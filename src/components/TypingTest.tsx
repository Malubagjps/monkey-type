import { useState, useEffect } from "react";

const PARAGRAPHS: string[] = [
  "The quick brown fox jumps over the lazy dog while the sun sets behind the mountains. Every developer needs to practice their typing skills to become more efficient at writing code.",
  "Learning to type faster can significantly improve your productivity as a programmer. The more comfortable you are with the keyboard, the easier it becomes to translate your thoughts into code.",
  "React components are the building blocks of modern web applications. They allow developers to create reusable pieces of user interface that can be composed together to build complex features.",
  "Practice makes perfect when it comes to typing. Regular practice sessions can help you develop muscle memory and increase your words per minute without sacrificing accuracy.",
  "Modern JavaScript frameworks like React have revolutionized how we build web applications. They provide powerful tools for managing state and creating interactive user interfaces.",
  "The best way to improve your typing speed is through consistent practice and proper finger placement on the keyboard. Focus on accuracy first and speed will naturally follow.",
  "Version control systems like Git help developers collaborate on projects and track changes over time. Understanding how to use these tools is essential for any software developer.",
  "Writing clean and maintainable code is just as important as writing code that works. Good coding practices help teams work together more effectively and make projects easier to understand."
];

const TIME_LIMIT = 30;

interface StatsCardProps {
  label: string;
  value: string | number;
  color?: string;
  highlight?: boolean;
}

const StatsCard = ({
  label,
  value,
  color = "text-slate-700",
  highlight = false
}: StatsCardProps) => (
  <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-slate-200">
    <div className="text-slate-500 text-sm mb-2">{label}</div>
    <div className={`text-4xl font-bold ${highlight ? "text-red-500" : color}`}>
      {value}
    </div>
  </div>
);

interface TypedWord {
  word: string;
  correct: boolean;
}

interface WordDisplayProps {
  words: string[];
  currentWordIndex: number;
  typedWords: TypedWord[];
  getCharStatus: (char: string, index: number) => string;
}


const WordDisplay = ({
  words,
  currentWordIndex,
  typedWords,
  getCharStatus
}: WordDisplayProps) => (

  <div className="bg-white rounded-2xl p-8 mb-8 min-h-48 shadow-sm border border-slate-200">
    <div className="flex flex-wrap gap-3 text-xl leading-relaxed">
      {words.map((word, wordIdx) => (
        <span
          key={wordIdx}
          className={`transition-colors duration-200 ${
            wordIdx === currentWordIndex
              ? "bg-blue-50 px-2 rounded-lg border border-blue-200"
              : wordIdx < currentWordIndex
              ? typedWords[wordIdx]?.correct
                ? "text-green-600"
                : "text-red-500"
              : "text-slate-400"
          }`}
        >
          {wordIdx === currentWordIndex
            ? word.split("").map((char, charIdx) => (
                <span key={charIdx} className={getCharStatus(char, charIdx)}>
                  {char}
                </span>
              ))
            : word}
        </span>
      ))}
    </div>
  </div>
);

interface ResultsProps {
  wpm: number;
  accuracy: number;
  typedWords: TypedWord[];
  correctChars: number;
  totalChars: number;
}

const Results = ({
  wpm,
  accuracy,
  typedWords,
  correctChars,
  totalChars
}: ResultsProps) => (
  <div className="bg-white rounded-2xl p-8 mb-8 shadow-sm border border-slate-200">
    <h2 className="text-3xl font-bold mb-8 text-center text-slate-800">
      Test Complete!
    </h2>
    <div className="grid grid-cols-3 gap-8 mb-8">
      <div className="text-center">
        <div className="text-slate-500 mb-3 text-lg">Words Per Minute</div>
        <div className="text-6xl font-bold text-blue-600">{wpm}</div>
      </div>
      <div className="text-center">
        <div className="text-slate-500 mb-3 text-lg">Accuracy</div>
        <div className="text-6xl font-bold text-green-600">{accuracy}%</div>
      </div>
      <div className="text-center">
        <div className="text-slate-500 mb-3 text-lg">Words Typed</div>
        <div className="text-6xl font-bold text-purple-600">
          {typedWords.length}
        </div>
      </div>
    </div>
    <div className="text-center text-slate-600 bg-slate-50 rounded-lg py-4">
      <span className="font-medium">Correct:</span>{" "}
      {typedWords.filter((w) => w.correct).length} •
      <span className="font-medium"> Incorrect:</span>{" "}
      {typedWords.filter((w) => !w.correct).length} •
      <span className="font-medium"> Characters:</span> {correctChars}/
      {totalChars}
    </div>
  </div>
);

const Instructions = () => (
  <div className="text-center mt-8 text-slate-600 bg-blue-50 rounded-xl p-6 border border-blue-200">
    <p className="font-medium mb-2">How to play:</p>
    <p>Type the paragraph you see above, pressing Space after each word</p>
    <p className="text-sm mt-2 text-slate-500">
      The test will automatically start when you begin typing
    </p>
  </div>
);

export default function TypingTest() {
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [currentInput, setCurrentInput] = useState<string>("");
  const [typedWords, setTypedWords] = useState<TypedWord[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(TIME_LIMIT);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [correctChars, setCorrectChars] = useState<number>(0);
  const [totalChars, setTotalChars] = useState<number>(0);

  const generateWords = (): string[] => {
    const numParagraphs = Math.floor(Math.random() * 2) + 2;
    const shuffled = [...PARAGRAPHS].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, numParagraphs);
    return selected.join(" ").split(" ");
  };

  useEffect(() => {
    setWords(generateWords());
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsActive(false);
            setIsFinished(true);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const calculateWPM = (): number => {
    const timeElapsed = TIME_LIMIT - timeLeft;
    if (timeElapsed === 0) return 0;
    return Math.round((correctChars / 5 / timeElapsed) * 60);
  };

  const calculateAccuracy = (): number => {
    if (totalChars === 0) return 0;
    return Math.round((correctChars / totalChars) * 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!isActive && !isFinished && value.length > 0) {
      setIsActive(true);
    }

    if (value.endsWith(" ")) {
      const typedWord = value.trim();
      const currentWord = words[currentWordIndex];

      if (typedWord) {
        const wordCorrectChars = currentWord
          .split("")
          .filter((char, idx) => typedWord[idx] === char).length;

        setCorrectChars((prev) => prev + wordCorrectChars);
        setTotalChars((prev) =>
          prev + Math.max(typedWord.length, currentWord.length)
        );

        setTypedWords([
          ...typedWords,
          { word: typedWord, correct: typedWord === currentWord }
        ]);
        setCurrentWordIndex((prev) => prev + 1);
      }
      setCurrentInput("");
    } else {
      setCurrentInput(value);
    }
  };

  const resetGame = () => {
    setWords(generateWords());
    setCurrentWordIndex(0);
    setCurrentInput("");
    setTypedWords([]);
    setTimeLeft(TIME_LIMIT);
    setIsActive(false);
    setIsFinished(false);
    setCorrectChars(0);
    setTotalChars(0);
  };

  const getCharStatus = (char: string, index: number): string => {
    if (index >= currentInput.length) return "text-gray-400";
    if (currentInput[index] === char) return "text-green-600";
    return "text-red-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3 text-slate-800">Typing Test</h1>
          <p className="text-slate-600">
            Test your typing speed and accuracy in {TIME_LIMIT} seconds
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <StatsCard
            label="Time Remaining"
            value={`${timeLeft}s`}
            highlight={timeLeft <= 5}
          />
          <StatsCard label="WPM" value={calculateWPM()} color="text-blue-600" />
          <StatsCard
            label="Accuracy"
            value={`${calculateAccuracy()}%`}
            color="text-green-600"
          />
        </div>

        {!isFinished ? (
          <WordDisplay
            words={words}
            currentWordIndex={currentWordIndex}
            typedWords={typedWords}
            getCharStatus={getCharStatus}
          />

        ) : (
          <Results
            wpm={calculateWPM()}
            accuracy={calculateAccuracy()}
            typedWords={typedWords}
            correctChars={correctChars}
            totalChars={totalChars}
          />
        )}

        {!isFinished && (
          <input
            type="text"
            value={currentInput}
            onChange={handleInputChange}
            disabled={isFinished}
            autoFocus
            className="w-full bg-white text-slate-800 text-xl p-5 rounded-xl outline-none border-2 border-slate-300 focus:border-blue-500 transition-colors disabled:opacity-50 placeholder-slate-400"
            placeholder={
              isActive
                ? "Type the words above..."
                : "Click here and start typing to begin..."
            }
          />
        )}

        <div className="text-center mt-8">
          <button
            onClick={resetGame}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-12 rounded-xl transition-colors shadow-sm hover:shadow-md"
          >
            {isFinished ? "Try Again" : "Restart Test"}
          </button>
        </div>

        {!isActive && !isFinished && <Instructions />}
      </div>
    </div>
  );
}
