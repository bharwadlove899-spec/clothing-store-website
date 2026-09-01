import re

with open('src/pages/Collections.tsx', 'r') as f:
    content = f.read()

old_pagination = """        {totalPages > 1 && (
          <div className="mt-16 hidden md:flex justify-center items-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrentPage(i + 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`w-10 h-10 flex items-center justify-center text-[10px] uppercase tracking-widest font-bold transition-colors ${
                  currentPage === i + 1
                    ? "bg-white text-black"
                    : "text-zinc-400 hover:text-white border border-zinc-800"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}"""

new_pagination = """        {totalPages > 1 && (
          <div className="mt-16 flex flex-wrap justify-center items-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrentPage(i + 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-4 h-10 flex items-center justify-center text-[10px] uppercase tracking-widest font-bold transition-colors ${
                  currentPage === i + 1
                    ? "bg-white text-black"
                    : "text-zinc-400 hover:text-white border border-zinc-800"
                }`}
              >
                Page {i + 1}
              </button>
            ))}
          </div>
        )}"""

if old_pagination in content:
    content = content.replace(old_pagination, new_pagination)
    print("Replaced successfully")
else:
    print("Not found")

with open('src/pages/Collections.tsx', 'w') as f:
    f.write(content)
