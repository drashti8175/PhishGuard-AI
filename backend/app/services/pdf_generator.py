import os
from io import BytesIO
from datetime import datetime, timezone
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

def generate_scan_pdf(scan_data: dict) -> BytesIO:
    """
    Constructs a beautifully formatted, recruiter-grade PDF audit report
    for a given scan result, utilizing ReportLab Flowables.
    """
    buffer = BytesIO()
    
    # 1. Setup Canvas Document Frame (Letter, 0.75-inch standard margins)
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=54,
        leftMargin=54,
        topMargin=54,
        bottomMargin=54
    )
    
    story = []
    
    # 2. Core Styling Sheets & Palettes
    styles = getSampleStyleSheet()
    
    primary_color_hex = "#0A0F1D"
    secondary_safe_hex = "#10B981"
    secondary_danger_hex = "#EF4444"
    
    primary_color = colors.HexColor(primary_color_hex) # Slate Blue bg
    neutral_grey = colors.HexColor("#F9FAFB")  # Subtle background panel
    dark_grey = colors.HexColor("#374151")     # High-contrast body text
    
    # Dynamic styling based on prediction outcome
    if scan_data["prediction"] == "Safe":
        secondary_color_hex = secondary_safe_hex
    else:
        secondary_color_hex = secondary_danger_hex
        
    secondary_color = colors.HexColor(secondary_color_hex)
        
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=22,
        textColor=primary_color,
        spaceAfter=8
    )
    
    h2_style = ParagraphStyle(
        'Heading2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        textColor=primary_color,
        spaceBefore=14,
        spaceAfter=8
    )
    
    body_style = ParagraphStyle(
        'BodyText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        textColor=dark_grey,
        spaceAfter=4
    )
    
    bold_body_style = ParagraphStyle(
        'BoldBodyText',
        parent=body_style,
        fontName='Helvetica-Bold'
    )
    
    # 3. Add Header Section
    story.append(Paragraph("🛡️ PhishGuard AI - Security Audit Report", title_style))
    audit_time = datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')
    ledger_id = scan_data.get('id', 'N/A')
    story.append(Paragraph(f"<b>Audit Date:</b> {audit_time} | <b>Security Ledger ID:</b> {ledger_id}", body_style))
    story.append(Spacer(1, 12))
    
    # 4. Summary Threat Panel Box
    target_value = scan_data.get("url") or scan_data.get("content_preview") or "Raw Input Payload"
    if len(target_value) > 65:
        target_value = target_value[:62] + "..."
        
    summary_table_data = [
        [
            Paragraph(f"<b>Target Analyzed:</b> {target_value}", body_style),
            Paragraph(f"<b>Scan Protocol:</b> {scan_data['type'].upper()}", body_style)
        ],
        [
            Paragraph(f"<b>Threat Classification:</b> <font color='{secondary_color_hex}'><b>{scan_data['prediction']}</b></font>", body_style),
            Paragraph(f"<b>Threat Risk Score:</b> <b>{scan_data['risk_score']}%</b>", body_style)
        ]
    ]
    
    summary_table = Table(summary_table_data, colWidths=[3.25*inch, 3.25*inch])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), neutral_grey),
        ('BOX', (0,0), (-1,-1), 1.5, secondary_color),
        ('PADDING', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    
    story.append(summary_table)
    story.append(Spacer(1, 15))
    
    # 5. Threat Indicator Explanations
    story.append(Paragraph("🔍 Structural Threat Analysis & Reasons", h2_style))
    reasons = scan_data.get("reasons", [])
    if reasons:
        for reason in reasons:
            story.append(Paragraph(f"• {reason}", body_style))
    else:
        story.append(Paragraph("No immediate structural anomaly profiles flagged.", body_style))
        
    story.append(Spacer(1, 15))
    
    # 6. Feature Matrix Table (For URLs/QRs containing URLs)
    # Extract features if available
    features = scan_data.get("features")
    if not features and scan_data.get("url_analysis"):
        features = scan_data["url_analysis"].get("features")
        
    if features:
        story.append(Paragraph("📊 Extracted Lexical & Security Feature Metrics", h2_style))
        
        feature_list = [
            ("URL String Length", str(features.get("url_length", 0)), "Phishers use long URLs to hide primary domains"),
            ("Dot count (.)", str(features.get("num_dots", 0)), "High dot counts suggest subdomain spoofing"),
            ("Is SSL HTTPS Active", "Yes (1)" if features.get("is_https") == 1 else "No (0)", "Lack of HTTPS flags high risk"),
            ("Direct IP Host Address", "Yes (1)" if features.get("has_ip") == 1 else "No (0)", "Direct IP usage avoids domain logs"),
            ("Is Link Shortened", "Yes (1)" if features.get("is_shortened") == 1 else "No (0)", "Shortening services hide destination path"),
            ("Dashes in Domain Name", "Yes (1)" if features.get("prefix_suffix") == 1 else "No (0)", "Hyphens mimic trademark portals"),
            ("Subdomain Nesting level", str(features.get("num_subdomains", 0)), "Nested subdomains bypass blacklists"),
            ("Credential keywords found", "Yes (1)" if features.get("has_suspicious_keywords") == 1 else "No (0)", "Keywords trigger user credential harvesting")
        ]
        
        # Build Table structure
        table_headers = [
            Paragraph("<b>Security Metric</b>", bold_body_style),
            Paragraph("<b>Status</b>", bold_body_style),
            Paragraph("<b>Cybersecurity Significance</b>", bold_body_style)
        ]
        
        table_rows = [table_headers]
        for name, value, desc in feature_list:
            table_rows.append([
                Paragraph(name, body_style),
                Paragraph(value, body_style),
                Paragraph(desc, body_style)
            ])
            
        features_table = Table(table_rows, colWidths=[2.2*inch, 1*inch, 3.8*inch])
        features_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#E5E7EB")),
            ('ALIGN', (0,0), (-1,-1), 'LEFT'),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#D1D5DB")),
            ('PADDING', (0,0), (-1,-1), 5),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ]))
        story.append(features_table)
        story.append(Spacer(1, 15))
        
    # 7. Threat Mitigation Guidelines
    story.append(Paragraph("🛡️ SecOps Actionable Mitigation Playbook", h2_style))
    if scan_data["prediction"] == "Phishing":
        story.append(Paragraph("<b>1. QUARANTINE PAYLOAD:</b> Do not click, forward, or enter details. Close any open tabs running this host.", body_style))
        story.append(Paragraph("<b>2. RESET CREDENTIALS:</b> If information was entered, immediately reset account passwords and notify admins.", body_style))
        story.append(Paragraph("<b>3. INCIDENT RESPONSE:</b> Log a threat ticket detailing this vector, preventing other organization endpoints from visiting.", body_style))
    else:
        story.append(Paragraph("<b>1. STANDARD VISITATION:</b> URL parameters match general safety ranges. Safe to navigate.", body_style))
        story.append(Paragraph("<b>2. VERIFY REGISTER PORTALS:</b> Even with secure profiles, ensure brand URLs are valid before password submission.", body_style))
        
    story.append(Spacer(1, 20))
    story.append(Paragraph("<i>Disclaimer: PhishGuard AI uses predictive machine learning heuristics. Always maintain corporate threat scanning protocols.</i>", body_style))
    
    # Build Document
    doc.build(story)
    buffer.seek(0)
    return buffer
