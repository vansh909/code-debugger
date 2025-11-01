# Code Debugger - Mini Code Execution Engine

This project is a **mini version of a code execution engine**, built with Node.js. Users can submit Python, JavaScript, or Java code, and the server executes it safely in an isolated environment using Node's `child_process` library.

---

## Features (Phase 1)

* 📝 Dynamically create temporary files for submitted code
* ⚡ Execute code using Node.js `child_process` in a separate process
* 🔎 Capture **output** and **errors** from code execution
* 🧹 Automatically clean up temporary files
* ⏱ Timeout protection to handle infinite loops

---

## Supported Languages

* Python (`.py`)
* JavaScript (`.js`)
* Java (`.java`)

---

## API Endpoint

**POST** `/api/execute`

### Request Body (JSON)

```json
{
  "language": "Java",
  "code": "public class Main {\n    public static void main(String[] args) {\n        int sum = 0;\n        for (int i = 1; i <= 10; i++) {\n            sum += i;\n        }\n        System.out.println(\"Sum of first 10 numbers: \" + sum);\n    }\n}"
}
```

### Response Example (JSON)

```json
{
  "success": true,
  "output": "Sum of first 10 numbers: 55\n",
  "error": null,
  "exitCode": 0
}
```

---

## Setup Instructions

1. Clone the repository:

```bash
git clone https://github.com/vansh909/code-debugger.git
```

2. Install dependencies:

```bash
cd code-debugger
npm install
```

3. Start the server:

```bash
node server.js
```

4. Test the API using Postman or any API client.

---

## Tech Stack

* Node.js
* Express.js
* child\_process (for isolated code execution)
* File System (fs) module


