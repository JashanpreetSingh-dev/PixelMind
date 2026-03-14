# Fix pip hanging / slow

## 1. Use a timeout so pip doesn’t hang forever

```powershell
pip install --default-timeout=15 <package>
```

Or set it once:

```powershell
pip config set global.timeout 15
```

## 2. If it’s a network/DNS issue

- **Try a different index:**
  ```powershell
  pip install -i https://pypi.org/simple/ --trusted-host pypi.org --trusted-host files.pythonhosted.org <package>
  ```
- **Disable IPv6** (if PyPI is slow over IPv6):  
  In Windows: Network settings → your adapter → uncheck IPv6, or add to `hosts`:  
  `151.101.0.223 pypi.org` (IPv4 only).

## 3. Reduce slow pip/Python startup

- **Exclude Python from real-time antivirus**  
  Add folder:  
  `C:\Users\jasha\AppData\Local\Packages\PythonSoftwareFoundation.Python.3.13_qbz5n2kfra8p0`
- **Use a faster installer (uv)**  
  Install uv then use it instead of pip:
  ```powershell
  pip install uv
  uv pip install <package>
  ```
  Or install uv from https://github.com/astral-sh/uv#installation and use `uv pip install` (often avoids the hang and is much faster).

## 4. See where it hangs (debug)

```powershell
pip install -v <package>
```

Watch the last line before it stops; that’s where it’s hanging (often “Fetching …” or “Resolving …”).

## 5. Offline / no network

If you only need to install from a cache or wheel:

```powershell
pip install --no-index --find-links=<path-to-wheels> <package>
```
