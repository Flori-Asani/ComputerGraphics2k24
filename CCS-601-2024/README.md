<h1>Computer Graphics</h1> <h2>CCS-601-2024</h2>
<b>Lecturer:</b> Visar Shehu
<b>Assistant:</b> Shqipe Salii

To use this repository, you need to clone it to your machine:

```
git clone https://github.com/salii-shqipe/CCS-601-2024.git
```

The repository is organized into directories, where each directory represents a specific week:

- Week I
- Week II
- Week III

To run the code, you need to navigate to the respective directory and install the required libraries (vite and three). For example:

```
cd "Week I"
npm install vite
npm install three
```

Once vite is installed, open the package.json file and make sure that the scripts section has the following content:

```
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  }
```
If everything is correct, you can start the project with:

```
npm run dev
```
