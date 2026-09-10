'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'

type Question = {
  q: string
  options: string[]
  answer: number // 0-based index
  fact: string
}

const questions: Question[] = [
  {
    q: 'How many digits does an Indian PIN code have?',
    options: ['4', '5', '6', '7'],
    answer: 2,
    fact: 'PIN stands for Postal Index Number and always has exactly 6 digits.',
  },
  {
    q: 'What do the first two digits of an Indian PIN code represent?',
    options: ['District', 'State', 'Postal Region / Sorting Circle', 'Post Office type'],
    answer: 2,
    fact: 'The first two digits indicate the postal region — for example, 11 = Delhi, 40 = Mumbai, 56 = Bengaluru.',
  },
  {
    q: 'What does IFSC stand for?',
    options: [
      'Indian Financial System Code',
      'International Fund Settlement Code',
      'Indian Fund System Code',
      'Interbank Financial Settlement Code',
    ],
    answer: 0,
    fact: 'IFSC — Indian Financial System Code — is an 11-character alphanumeric code assigned by RBI to each bank branch.',
  },
  {
    q: 'How many characters does an IFSC code have?',
    options: ['9', '10', '11', '12'],
    answer: 2,
    fact: 'An IFSC code is exactly 11 characters: 4 letters (bank code) + "0" (control digit) + 6 characters (branch code).',
  },
  {
    q: 'Which digit in an IFSC code is always "0"?',
    options: ['1st', '3rd', '5th', '11th'],
    answer: 2,
    fact: 'The 5th character is always "0" — it is the control digit reserved by RBI.',
  },
  {
    q: 'What is the highest PIN code in India?',
    options: ['737101 (Arunachal Pradesh)', '737126 (Arunachal Pradesh)', '744101 (Andaman)', '764036 (Odisha)'],
    answer: 1,
    fact: 'PIN codes in the 737xxx range belong to Arunachal Pradesh, one of the highest-numbered postal regions.',
  },
  {
    q: 'India Post was formerly known as?',
    options: ['Royal Mail India', 'Imperial Post Office', 'British Indian Postal Service', 'Department of Posts'],
    answer: 1,
    fact: 'The Imperial Post Office was renamed "India Post" in 1947 after independence.',
  },
  {
    q: 'What is the maximum weight for a Speed Post ( domestic )?',
    options: ['5 kg', '10 kg', '20 kg', '35 kg'],
    answer: 2,
    fact: 'Domestic Speed Post accepts parcels up to 20 kg. Rates vary by weight and destination zone.',
  },
  {
    q: 'Which of these is NOT a valid payment transfer system?',
    options: ['NEFT', 'RTGS', 'IMPS', 'IFSC'],
    answer: 3,
    fact: 'IFSC is a bank branch identification code, not a payment system. NEFT, RTGS and IMPS are electronic fund transfer systems.',
  },
  {
    q: 'In what year was the PIN code system introduced in India?',
    options: ['1962', '1972', '1982', '1992'],
    answer: 1,
    fact: 'The PIN code system was launched on 15 August 1972 to simplify mail sorting and delivery across India.',
  },
  {
    q: 'Which Indian city has the PIN code 110001?',
    options: ['Mumbai', 'New Delhi', 'Kolkata', 'Chennai'],
    answer: 1,
    fact: 'PIN code 110001 belongs to the New Delhi Head Office — one of the most recognised PIN codes in India.',
  },
  {
    q: 'What does "BO" stand for in post office types?',
    options: ['Bank Office', 'Branch Office', 'Billing Office', 'Box Office'],
    answer: 1,
    fact: 'BO = Branch Office — the smallest unit in the postal network, usually in rural areas. SO = Sub Office, HO = Head Office.',
  },
]

export default function QuizPage() {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [showFact, setShowFact] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [bestScore, setBestScore] = useState<number | null>(null)

  // Load best score from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('ms-quiz-best')
      if (stored !== null) setBestScore(parseInt(stored, 10))
    } catch { /* ignore */ }
  }, [])

  const saveBest = useCallback((s: number) => {
    try {
      const prev = parseInt(localStorage.getItem('ms-quiz-best') || '0', 10)
      if (s > prev) {
        localStorage.setItem('ms-quiz-best', String(s))
        setBestScore(s)
      }
    } catch { /* ignore */ }
  }, [])

  const q = questions[current]

  const handleSelect = (idx: number) => {
    if (selected !== null) return // already answered
    setSelected(idx)
    setShowFact(true)
    if (idx === q.answer) setScore((s) => s + 1)
  }

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      setFinished(true)
      const finalScore = selected === q.answer ? score : score
      saveBest(finalScore)
    } else {
      setCurrent((c) => c + 1)
      setSelected(null)
      setShowFact(false)
    }
  }

  const handleRestart = () => {
    setCurrent(0)
    setSelected(null)
    setShowFact(false)
    setScore(0)
    setFinished(false)
  }

  // Score results
  const pct = Math.round((score / questions.length) * 100)
  const resultEmoji = pct >= 80 ? '🏆' : pct >= 60 ? '🎉' : pct >= 40 ? '👍' : '📚'
  const resultMsg =
    pct >= 80
      ? 'Outstanding! You\'re a postal trivia master!'
      : pct >= 60
      ? 'Great job! You know your Indian postal system well.'
      : pct >= 40
      ? 'Not bad! A bit more practice and you\'ll ace it.'
      : 'Time to brush up on your India Post knowledge!'

  if (finished) {
    return (
      <div className="min-h-screen flex flex-col pt-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16">
          <div className="text-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 mt-12 shadow-sm">
            <p className="text-6xl mb-4">{resultEmoji}</p>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">
              Quiz Complete!
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">{resultMsg}</p>
            <div className="flex items-center justify-center gap-8 mb-8">
              <div>
                <p className="text-4xl font-bold text-primary dark:text-blue-400">{score}/{questions.length}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Score</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-accent dark:text-emerald-400">{pct}%</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Accuracy</p>
              </div>
              {bestScore !== null && (
                <div>
                  <p className="text-4xl font-bold text-amber-500">{bestScore}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Best Score</p>
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleRestart}
                className="px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition"
              >
                Try Again
              </button>
              <Link
                href="/search"
                className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Search PIN Codes →
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col pt-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">
            🧠 Postal Quiz
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Test your knowledge of Indian PIN codes, IFSC codes, and the postal system.
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-2">
            <span>Question {current + 1} of {questions.length}</span>
            <span>Score: {score}</span>
          </div>
          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary dark:bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${((current + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question card */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-5">
            {q.q}
          </h2>
          <div className="space-y-3">
            {q.options.map((opt, i) => {
              const isCorrect = i === q.answer
              const isPicked = selected === i
              let style = 'border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-900/60'
              if (selected !== null) {
                if (isCorrect) style = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                else if (isPicked && !isCorrect) style = 'border-red-500 bg-red-50 dark:bg-red-900/20'
                else style = 'border-slate-200 dark:border-slate-700 opacity-60'
              }
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={selected !== null}
                  className={`w-full text-left px-5 py-3.5 rounded-xl border-2 text-sm font-medium transition-all duration-150 ${style}`}
                >
                  <span className="text-slate-400 dark:text-slate-500 mr-2">{String.fromCharCode(65 + i)}.</span>
                  {opt}
                </button>
              )
            })}
          </div>

          {/* Fact reveal */}
          {showFact && (
            <div className="mt-5 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                💡 <strong>Did you know?</strong> {q.fact}
              </p>
            </div>
          )}

          {/* Next button */}
          {selected !== null && (
            <div className="mt-6 text-center">
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition"
              >
                {current + 1 >= questions.length ? 'See Results →' : 'Next Question →'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}