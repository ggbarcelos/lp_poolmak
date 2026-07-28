import fitz
import os

pdf_path = "/Users/banana/Documents/Projetos/GotoMobi/LPs/lp_poolmak/Catalogo Poolmak Sistemas Estruturais 2023.pdf"
output_dir = "/Users/banana/Documents/Projetos/GotoMobi/LPs/lp_poolmak/clientes"
os.makedirs(output_dir, exist_ok=True)

doc = fitz.open(pdf_path)
page_index = 14  # page 15 (0-indexed)
if page_index >= len(doc):
    print(f"Page {page_index+1} does not exist. Total pages: {len(doc)}")
else:
    page = doc[page_index]
    images = page.get_images(full=True)
    print(f"Found {len(images)} images on page {page_index+1}")
    for idx, img in enumerate(images):
        xref = img[0]
        base_image = doc.extract_image(xref)
        image_bytes = base_image["image"]
        image_ext = base_image["ext"]
        # Save as PNG
        out_path = os.path.join(output_dir, f"logo_page15_{idx+1}.png")
        with open(out_path, "wb") as f:
            f.write(image_bytes)
        print(f"Saved {out_path}")

doc.close()
print("Done")