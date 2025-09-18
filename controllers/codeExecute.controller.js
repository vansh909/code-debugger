
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

exports.CodeExecute = (req, res) => {
    let { language, code } = req.body;


    if (!language || !code) {
        return res.status(400).json({ error: "Language and code are required" });
    }

    language = language.toLowerCase();
 
    const fileMap = {
        python: { ext: "py", run: ["python3"] },
        javascript: { ext: "js", run: ["node"] },
        java: { ext: "java", run: ["javac", "java"] },
    };

    if (!fileMap[language.toLowerCase()]) {
        return res.status(400).json({ error: "Unsupported language" });
    }

    const tempDir = path.join(__dirname, "temp");
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }

    let fileName;
    let filePath;
    let finalCode = code;

    if (language === "java") {
     
        const className = `Code${Date.now()}`;
        fileName = `${className}.java`;
        filePath = path.join(tempDir, fileName);

        
        finalCode = code.replace(/public\s+class\s+\w+/, `public class ${className}`);
    } else {
        fileName = `code-${Date.now()}.${fileMap[language.toLowerCase()].ext}`;
        filePath = path.join(tempDir, fileName);
    }

   
    fs.writeFileSync(filePath, finalCode);

    let process;
    let timeout;


    if (language.toLowerCase() === "java") {
        const className = path.basename(fileName, ".java");
        process = spawn("bash", ["-c", `cd "${tempDir}" && javac "${fileName}" && java "${className}"`]);
    } else {
        process = spawn(fileMap[language.toLowerCase()].run[0], [filePath], { shell: false });
    }

    let output = "";
    let error = "";

   
    process.stdout.on("data", (data) => {
        output += data.toString();
    });

   
    process.stderr.on("data", (data) => {
        error += data.toString();
    });

   
    process.on("error", (err) => {
        clearTimeout(timeout);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        return res.status(500).json({ error: "Execution failed", details: err.message });
    });


    timeout = setTimeout(() => {
        process.kill("SIGKILL");
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        return res.status(408).json({ error: "Execution timeout! Infinite loop detected." });
    }, 5000);


    process.on("close", (code) => {
        clearTimeout(timeout);

        
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        // ✅ Delete Java .class file
        if (language === "java") {
            const classFile = path.join(tempDir, `${path.basename(fileName, ".java")}.class`);
            if (fs.existsSync(classFile)) fs.unlinkSync(classFile);
        }

        return res.json({
            success: true,
            output: output || null,
            error: error || null,
            exitCode: code,
        });
    });
};
