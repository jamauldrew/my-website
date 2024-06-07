import React, { useState } from 'react'

function ExampleComponent() {
  const [result, setResult] = useState({ output: '', error: '' })

  const runTool = async () => {
    const response = await fetch('/api/run-tool')
    const data = await response.json()
    setResult(data)
  }

  return (
    <div>
      <button onClick={runTool}>Run QAQC Tool</button>
      {result.output && (
        <div>
          <h3>Output:</h3>
          <pre>{result.output}</pre>
        </div>
      )}
      {result.error && (
        <div>
          <h3>Error:</h3>
          <pre>{result.error}</pre>
        </div>
      )}
    </div>
  )
}

export default ExampleComponent
