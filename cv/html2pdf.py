from pathlib import Path
from weasyprint import HTML, CSS

def convert_to_pdf(html_path: str, pdf_path: str = None) -> None:
    html_path = Path(html_path)
    if pdf_path is None:
        pdf_path = html_path.with_suffix('.pdf')
    else:
        pdf_path = Path(pdf_path)

    HTML(html_path).write_pdf(pdf_path)
    print(f"PDF saved to: {pdf_path.resolve()}")

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python html2pdf.py <html_file> [pdf_file]")
        sys.exit(1)

    convert_to_pdf(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else None)
