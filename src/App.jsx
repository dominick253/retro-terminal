import { useState, useEffect, useRef } from 'react'

function App() {
  const [history, setHistory] = useState([])
  const [input, setInput] = useState('')
  const [bootComplete, setBootComplete] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const inputRef = useRef(null)
  const bottomRef = useRef(null)

  const bootMessages = [
    { text: 'ROM BIOS v1.0.3 - (C) 1989', delay: 100 },
    { text: 'CPU: 8086 @ 4.77MHz', delay: 400 },
    { text: '640K RAM SYSTEM OK', delay: 700 },
    { text: 'INITIALIZING VIDEO... CGA DETECTED', delay: 1100 },
    { text: 'KEYBOARD: 83-KEY KB DETECTED', delay: 1500 },
    { text: 'LOADING DOS...', delay: 1900 },
    { text: 'HIMEM.SYS loaded', delay: 2300 },
    { text: 'MOUSE.SYS loaded', delay: 2600 },
    { text: 'CD-ROM: 2X SPEED OK', delay: 3000 },
    { text: 'NETWORK: NOVELL NETWARE READY', delay: 3400 },
    { text: '', delay: 3800 },
    { text: '═══════════════════════════════════════', delay: 3900 },
    { text: '   RETRO TERMINAL v2.0 [SYSTEM READY]', delay: 4000 },
    { text: '═══════════════════════════════════════', delay: 4100 },
    { text: '', delay: 4300 },
    { text: 'Type HELP for available commands.', delay: 4400 },
    { text: '', delay: 4500 },
  ]

  const [bootOutput, setBootOutput] = useState([])

  useEffect(() => {
    let delay = 0
    bootMessages.forEach((msg) => {
      delay += msg.delay - (bootMessages[bootMessages.indexOf(msg) - 1]?.delay || 0)
      setTimeout(() => {
        setBootOutput(prev => [...prev, msg.text])
        if (msg.text === 'Type HELP for available commands.') {
          setTimeout(() => setBootComplete(true), 300)
        }
      }, delay)
    })
  }, [])

  useEffect(() => {
    if (bootComplete && inputRef.current) {
      inputRef.current.focus()
    }
  }, [bootComplete])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  const typeText = async (text, speed = 30) => {
    setIsTyping(true)
    const typed = []
    for (let i = 0; i < text.length; i++) {
      typed.push(text[i])
      setHistory(prev => {
        const newHistory = [...prev]
        newHistory[newHistory.length - 1].output = typed.join('')
        return newHistory
      })
      await new Promise(r => setTimeout(r, speed))
    }
    setIsTyping(false)
  }

  const processCommand = async (cmd) => {
    const command = cmd.trim().toLowerCase()
    setHistory(prev => [...prev, { command: cmd, output: '' }])

    await new Promise(r => setTimeout(r, 200))

    switch (command) {
      case 'help':
        await typeText(`AVAILABLE COMMANDS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  HELP    - Display this help message
  ABOUT   - Information about this terminal
  PROJECTS - View my projects portfolio
  CONTACT - Get in touch with me
  CLEAR   - Clear the terminal screen
  DATE    - Display current date/time
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`, 15)
        break
      case 'about':
        await typeText(`╔══════════════════════════════════════╗
║        RETRO TERMINAL v2.0              ║
║        ───────────────────              ║
║                                        ║
║  A nostalgic journey back to the        ║
║  golden era of computing. This          ║
║  simulation recreates the authentic     ║
║  feel of early computer terminals       ║
║  from the late 80s and early 90s.       ║
║                                        ║
║  Features:                             ║
║  • CRT monitor simulation              ║
║  • Phosphor glow effects               ║
║  • Scanline rendering                  ║
║  • Authentic green-on-black            ║
║                                        ║
╚══════════════════════════════════════╝`, 20)
        break
      case 'projects':
        await typeText(`PROJECT PORTFOLIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

> TERMINAL-EMULATOR (2024)
  A React-based retro terminal with CRT
  effects. Typewriter animations & CLI.

> DOS-SIMULATOR (2023)
  Browser-based MS-DOS environment with
  classic games & applications.

> CYBERPUNK-DASHBOARD (2023)
  Futuristic UI with neon aesthetics
  and real-time data visualization.

> VINTAGE-WEBSITE (2022)
  Web design from the early internet era.
  Pure HTML/CSS, no JavaScript.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type CONTACT to get in touch!`, 20)
        break
      case 'contact':
        await typeText(`═══════════════════════════════════════
       CONTACT INFORMATION
═══════════════════════════════════════

  📧 Email:    retro@terminal.dev
  🐙 GitHub:   github.com/retro-term
  📱 Twitter:  @retro_terminal
  📍 Location: Cyberspace, Net

═══════════════════════════════════════
    Feel free to reach out anytime!
═══════════════════════════════════════`, 25)
        break
      case 'clear':
        setHistory([])
        break
      case 'date':
        const now = new Date()
        await typeText(`Current Date/Time: ${now.toLocaleString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })}
Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`, 30)
        break
      case '':
        setHistory(prev => [...prev, { command: '', output: '' }])
        break
      default:
        await typeText(`BAD COMMAND OR FILE NAME: "${command}"
Type HELP for available commands.`, 20)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    processCommand(input)
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'c' && e.ctrlKey) {
      setHistory(prev => [...prev, { command: '^C', output: '' }])
    }
  }

  if (!bootComplete) {
    return (
      <div className="crt-screen">
        <div className="scanlines"></div>
        <div className="boot-screen">
          {bootOutput.map((line, i) => (
            <div key={i} className="boot-line">{line}</div>
          ))}
          <div className="boot-cursor"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="crt-screen" onClick={() => inputRef.current?.focus()}>
      <div className="scanlines"></div>
      <div className="crt-glow">
        <div className="terminal">
          <div className="terminal-header">
            <span className="terminal-title">RETRO-TERM v2.0</span>
            <div className="terminal-buttons">
              <span className="btn-minimize">_</span>
              <span className="btn-maximize">□</span>
              <span className="btn-close">×</span>
            </div>
          </div>
          
          <div className="terminal-content">
            {history.map((entry, i) => (
              <div key={i} className="history-entry">
                {entry.command && (
                  <div className="command-line">
                    <span className="prompt">guest@retro:~$</span>
                    <span className="cmd">{entry.command}</span>
                  </div>
                )}
                {entry.output && <pre className="output">{entry.output}</pre>}
              </div>
            ))}

            <form onSubmit={handleSubmit} className="input-line">
              <span className="prompt">guest@retro:~$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="terminal-input"
                autoFocus
                spellCheck="false"
                autoComplete="off"
              />
              <span className={`cursor ${isTyping ? 'hidden' : ''}`}>█</span>
            </form>
            <div ref={bottomRef}></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App