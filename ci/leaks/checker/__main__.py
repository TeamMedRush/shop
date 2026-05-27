MODULE_LOCKS = {
  "api": ["data"],
  "components": ["routes"],
  "contexts": ["routes"],
  "data": ["contexts"],
  "interfaces": ["transformers"],
  "registry": ["*"],
  "routes": [],
  "transformers": ["contexts"],
  "utils": ["*"],
}

def safe_read(path: str) -> str:
  content = ""

  try:
    with open(path, "r") as f:
      content = f.read()
  except Exception as e:
    print(f"Error reading file {path}: {e}")

  return content

def analyze_file(path: str):
  content = safe_read(path)
  print(content)

def main():
  filename = "initial"

  while filename:
    filename = input("Filename (leave empty to exit): ")

    if filename:
      analyze_file(filename)

if __name__ == "__main__":
  exit_code = main()
  exit(exit_code)

