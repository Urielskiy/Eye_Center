'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye } from "lucide-react";

const MIN_WPM = 50;
const MAX_WPM = 800;

export default function Home() {
  const [text, setText] = useState('');
  const [words, setWords] = useState<string[]>([]);
  const [allScreens, setAllScreens] = useState<string[][]>([]);
  const [wpm, setWpm] = useState(150);
  const [lineWidth, setLineWidth] = useState(3);
  const [fontSize, setFontSize] = useState('medium');
  const [isRunning, setIsRunning] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeTaken, setTimeTaken] = useState(0);
  const showerRef = useRef<HTMLDivElement>(null);
  const [linesPerShow, setLinesPerShow] = useState(1);
  const [screen, setScreen] = useState(1);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  // Функція для розбиття тексту на екрани та рядки
  const prepareScreens = (words: string[], wordsPerLine: number, linesPerScreen: number) => {
    const chunkSize = wordsPerLine * linesPerScreen;
    const screens: string[][] = [];
    
    for (let i = 0; i < words.length; i += chunkSize) {
      const chunk = words.slice(i, i + chunkSize);
      const screen: string[] = [];
      
      for (let j = 0; j < chunk.length; j += wordsPerLine) {
        const rowWords = chunk.slice(j, j + wordsPerLine);
        screen.push(rowWords.join(" "));
      }
      
      screens.push(screen);
    }
    
    return screens;
  };

  const splitText = () => {
    // Очищаємо текст від зайвих пробілів та розбиваємо на слова
    const cleanedText = text.trim();
    const wordArray = cleanedText.split(/\s+/).filter(word => word !== '');
    setWords(wordArray);
    
    // Розбиваємо текст на екрани та рядки
    const screens = prepareScreens(wordArray, lineWidth, linesPerShow);
    setAllScreens(screens);
    
    setWordIndex(0);
    setIsRunning(false);
    setStartTime(null);
    setTimeTaken(0);
    setScreen(2);
  };

  // Ефект для оновлення екранів при зміні налаштувань
  useEffect(() => {
    if (words.length > 0) {
      const screens = prepareScreens(words, lineWidth, linesPerShow);
      setAllScreens(screens);
    }
  }, [lineWidth, linesPerShow, words]);

  useEffect(() => {
    if (isRunning && words.length > 0) {
      if (startTime === null) {
        setStartTime(Date.now());
      }

      const intervalTime = 60000 / wpm; // Interval in milliseconds
      const intervalId = setInterval(() => {
        setWordIndex((prevIndex) => {
          const chunkSize = lineWidth * linesPerShow;
          const newIndex = prevIndex + chunkSize;
          
          // Перевірка, чи досягли кінця тексту
          if (newIndex >= words.length) {
            setIsRunning(false);
            clearInterval(intervalId);
            const endTime = Date.now();
            setTimeTaken((endTime - (startTime || endTime)) / 1000);
            setScreen(3); // Перехід на екран результатів
            return prevIndex;
          }
          
          // Повертаємо новий індекс слова
          return newIndex;
        });
      }, intervalTime);

      return () => clearInterval(intervalId);
    }
  }, [isRunning, wpm, words, startTime, lineWidth, linesPerShow]);

  const toggleReading = () => {
    if (words.length === 0) {
      alert('Будь ласка, введіть текст спочатку.');
      return;
    }
    setIsRunning((prevIsRunning) => !prevIsRunning);
  };

  const calculateReadingSummary = () => {
    const totalWords = words.length;
    return {
      totalWords,
      timeTaken,
    };
  };

  const summary = calculateReadingSummary();

  const getLinesForDisplay = () => {
    // Визначаємо поточний екран для відображення
    const chunkSize = lineWidth * linesPerShow;
    const currentScreenIndex = Math.floor(wordIndex / chunkSize);
    
    // Якщо екрани ще не підготовлені або індекс за межами, повертаємо порожній масив
    if (allScreens.length === 0 || currentScreenIndex >= allScreens.length) {
      return [];
    }
    
    // Повертаємо рядки поточного екрану
    return allScreens[currentScreenIndex];
  };

  // Цей useEffect видалено, щоб уникнути дублювання логіки

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors">
      <div className="container mx-auto p-4 md:p-6 flex flex-col gap-4 items-center">
      {screen === 1 && (
        <div className="flex justify-center items-center h-screen scale-100">
          <Card className="w-full max-w-[calc(200%+1800%)] border-blue-500 shadow-lg">
            <CardHeader>
              <CardTitle className="flex flex-col items-center">
                <Eye className="mb-2" size={28} />
                <div className="text-center">
                  Онлайн тренажер для швидкісного читання
                </div>
                <div className="text-center text-xl font-bold mt-1">
                  "Око в центр"
                </div>
              </CardTitle>
              <CardDescription className="text-center mt-2 max-w-md mx-auto">
                Вставте текст у діалогове вікно нижче і натисніть кнопку "Обробка тексту" для підготовки до тренування.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid w-full max-w-xl mx-auto items-center gap-2.5">
                <Label htmlFor="message" className="text-base font-medium">Вхідний текст</Label>
                <textarea
                  id="message"
                  value={text}
                  onChange={handleTextChange}
                  placeholder="Вставте ваш текст сюди..."
                  className="flex h-96 w-full rounded-lg border-2 border-input bg-background px-4 py-3 text-base shadow-sm transition-colors ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div className="flex justify-center mt-4">
                <Button 
                  onClick={splitText} 
                  className="px-6 py-2 text-base font-medium rounded-lg transition-all hover:shadow-md hover:scale-105 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                >
                  Обробка тексту
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {screen === 2 && (
        <div className="flex flex-col items-center scale-100 max-w-4xl mx-auto">
          {/* Second Block: Text Shower Display */}
          <div className="flex justify-center items-center mt-8 w-full">
            <Card className="w-full border-blue-500 shadow-xl bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
              <CardHeader>
                <CardTitle className="text-center text-lg font-medium text-blue-700 dark:text-blue-300">Тренування</CardTitle>
                <CardDescription className="text-center text-blue-600/70 dark:text-blue-400/70 mt-1">
                  Налаштуйте параметри читання, та натисніть кнопку "Почати читання"
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  ref={showerRef}
                  className={`text-center p-6 font-mono rounded-lg shadow-inner bg-white dark:bg-gray-800 border border-blue-100 dark:border-blue-900 transition-all`}
                  style={{ 
                    fontSize: fontSize === 'small' ? '1rem' : fontSize === 'large' ? '1.5rem' : '1.2rem',
                    minHeight: '12rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  {words.length > 0 ? (
                    <>
                      {getLinesForDisplay().map((line, index) => (
                        <span key={index} className="block font-medium my-1">{line}</span>
                      ))}
                    </>
                  ) : (
                    <span className="text-muted-foreground">Введіть текст та обробіть його, щоб почати читання.</span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Third Block: Settings */}
          <div className="flex justify-center items-center mt-8 w-full">
            <Card className="w-full border-blue-500 shadow-xl bg-white dark:bg-gray-900">
              <CardHeader className="border-b border-blue-100 dark:border-blue-900 bg-blue-50 dark:bg-gray-800 rounded-t-lg">
                <CardTitle className="text-blue-700 dark:text-blue-300 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                  Налаштування
                </CardTitle>
                <CardDescription className="text-blue-600/70 dark:text-blue-400/70">Налаштуйте параметри читання для кращого досвіду.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-6 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="wpm" className="text-base font-medium flex items-center justify-between">
                      <span>Швидкість читання</span>
                      <span className="text-blue-600 font-bold">{wpm} слів/хв</span>
                    </Label>
                    <Slider
                      id="wpm"
                      defaultValue={[wpm]}
                      min={MIN_WPM}
                      max={MAX_WPM}
                      step={10}
                      onValueChange={(value) => setWpm(value[0])}
                      className="py-2"
                    />
                    <p className="text-xs text-muted-foreground">Збільшуйте швидкість для тренування швидкого читання</p>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="line-width" className="text-base font-medium">Кількість слів в рядку ({lineWidth})</Label>
                    <Select onValueChange={(value) => setLineWidth(parseInt(value))} defaultValue={String(lineWidth)}>
                      <SelectTrigger className="flex h-10 w-full rounded-lg border-2 border-input bg-background px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                        <SelectValue placeholder="Оберіть кількість" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((num) => (
                          <SelectItem key={num} value={String(num)}>{num}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Кількість слів, які будуть показані в одному рядку</p>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="lines-per-show" className="text-base font-medium">Кількість рядків для показу ({linesPerShow})</Label>
                    <Select onValueChange={(value) => setLinesPerShow(parseInt(value))} defaultValue={String(linesPerShow)}>
                      <SelectTrigger className="flex h-10 w-full rounded-lg border-2 border-input bg-background px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                        <SelectValue placeholder="Оберіть кількість" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((num) => (
                          <SelectItem key={num} value={String(num)}>{num}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Кількість рядків, які будуть показані одночасно</p>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="font-size" className="text-base font-medium">Розмір шрифту</Label>
                    <select
                      id="font-size"
                      value={fontSize}
                      onChange={(e) => setFontSize(e.target.value)}
                      className="flex h-10 w-full rounded-lg border-2 border-input bg-background px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus-visible:outline-none"
                    >
                      <option value="small">Малий</option>
                      <option value="medium">Середній</option>
                      <option value="large">Великий</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-center mt-4">
                  <Button 
                    onClick={toggleReading} 
                    disabled={words.length === 0}
                    className="px-6 py-2 text-base font-medium rounded-lg transition-all hover:shadow-md hover:scale-105 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {isRunning ? 'Пауза' : 'Почати'} Читання
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {screen === 3 && words.length > 0 && !isRunning && timeTaken > 0 && (
        <div className="flex justify-center items-center h-screen scale-100">
          <Card className="animate-in fade-in slide-in-from-bottom-5 duration-500 border-blue-500 shadow-xl max-w-md w-full bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
            <CardHeader className="pb-2">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                </div>
              </div>
              <CardTitle className="text-center text-2xl font-bold text-blue-700 dark:text-blue-300">Підсумок читання</CardTitle>
              <CardDescription className="text-center text-blue-600/70 dark:text-blue-400/70">Ви успішно завершили тренування читання!</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-blue-100 dark:border-blue-900">
                    <p className="text-sm text-muted-foreground">Прочитано слів</p>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{summary.totalWords}</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-blue-100 dark:border-blue-900">
                    <p className="text-sm text-muted-foreground">Час читання</p>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{summary.timeTaken.toFixed(1)} с</p>
                  </div>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/30 p-5 rounded-lg border border-blue-100 dark:border-blue-800 mt-4">
                  <div className="flex items-center justify-between">
                    <p className="text-base font-medium">Швидкість читання</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{(summary.totalWords / (summary.timeTaken / 60)).toFixed(0)} <span className="text-sm font-normal">слів/хв</span></p>
                  </div>
                  <div className="mt-2 h-2 w-full bg-blue-200 dark:bg-blue-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-blue-500" 
                      style={{ width: `${Math.min(100, ((summary.totalWords / (summary.timeTaken / 60)) / MAX_WPM) * 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex justify-center mt-6">
                  <Button 
                    onClick={() => setScreen(1)}
                    className="px-6 py-2 text-base font-medium rounded-lg transition-all hover:shadow-md hover:scale-105 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  >
                    Почати нове тренування
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      </div>
    </div>
  );
}

