import re

with open('src/pages/Home.tsx', 'r') as f:
    content = f.read()

# 1. Remove state
content = content.replace("const [combos, setCombos] = useState<Product[]>([]);\n  ", "")

# 2. Remove fetch logic
combo_fetch = """
        const comboQ = query(
          collection(db, 'products'),
          where('is_active', '==', true),
          where('category', '==', 'Combo'),
          orderBy('created_at', 'desc'),
          limit(2)
        );
        const comboSnap = await getDocs(comboQ);
        setCombos(comboSnap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));"""
content = content.replace(combo_fetch, "")

# 3. Remove section
start_marker = "{/* Exclusive Combos Row */}"
end_marker = "{/* Product Modal */}"

if start_marker in content and end_marker in content:
    start_idx = content.find(start_marker)
    end_idx = content.find(end_marker, start_idx)
    content = content[:start_idx] + content[end_idx:]

with open('src/pages/Home.tsx', 'w') as f:
    f.write(content)
