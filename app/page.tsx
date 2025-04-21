"use client"

import { useState, useRef, useEffect } from "react"
import * as d3 from "d3"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { EventItem } from "@/components/event-item"
import { EventsCounter } from "@/components/events-counter"

// Tabs for the main dashboard
const tabs = [
  { id: "tech-collectors", label: "Технологи (Коллекторы)" },
  { id: "safety-collectors", label: "Безопасность (Коллекторы)" },
  { id: "safety-office", label: "Безопасность (Офис)" },
  { id: "fire-parking", label: "Пожарная безопасность (Паркинг)" },
]

// Пример данных для графиков
const hotWaterData = [
  { day: "Пн", temp: 62 },
  { day: "Вт", temp: 64 },
  { day: "Ср", temp: 68 },
  { day: "Чт", temp: 65 },
  { day: "Пт", temp: 63 },
  { day: "Сб", temp: 66 },
  { day: "Вс", temp: 65 },
]

const coldWaterData = [
  { day: "Пн", temp: 12 },
  { day: "Вт", temp: 11 },
  { day: "Ср", temp: 10 },
  { day: "Чт", temp: 9 },
  { day: "Пт", temp: 8 },
  { day: "Сб", temp: 9 },
  { day: "Вс", temp: 10 },
]

const electricLineData = [
  { day: "Пн", temp: 40 },
  { day: "Вт", temp: 41 },
  { day: "Ср", temp: 43 },
  { day: "Чт", temp: 42 },
  { day: "Пт", temp: 44 },
  { day: "Сб", temp: 43 },
  { day: "Вс", temp: 42 },
]

// Пример данных для термограммы
const generateHeatmapData = () => {
  const data = []
  const days = 1
  const distances = 15

  for (let day = 0; day < days; day++) {
    for (let distance = 0; distance < distances; distance++) {
      // Создаем базовую температуру с некоторыми паттернами
      let temp = 30 + Math.sin(distance / 2) * 10 + Math.cos(day) * 5

      // Добавляем случайные вариации
      temp += Math.random() * 10 - 5

      // Добавляем "горячую точку" в определенном месте
      if (day === 0 && distance >= 7 && distance <= 9) {
        temp += 15
      }

      data.push({
        day,
        distance,
        value: temp,
      })
    }
  }

  return data
}

const heatmapData = generateHeatmapData()

// Пример данных для событий технологов
const techEvents = [
  {
    id: 1,
    type: "leak",
    title: "Утечка теплоносителя",
    location: "в 255 м от начала",
    distance: "235 м от начала",
    status: "Активно",
    color: "red",
    severity: "high",
    description: "Обнаружена утечка теплоносителя на расстоянии 235 метров от входа в коллектор.",
    recommendations: "Рекомендуется направить ремонтную бригаду для локализации и устранения утечки.",
  },
  {
    id: 2,
    type: "leak",
    title: "Утечка холодной воды",
    location: "в 83 м от начала",
    distance: "83 м от начала",
    status: "Активно",
    color: "blue",
    severity: "medium",
    description: "Обнаружена утечка холодной воды на расстоянии 83 метров от входа в коллектор.",
    recommendations: "Рекомендуется проверить состояние трубопровода и устранить утечку.",
  },
  {
    id: 3,
    type: "overheat",
    title: "Перегрев кабеля",
    location: "на расстоянии 230 м",
    status: "Активно",
    color: "yellow",
    severity: "medium",
    description: "Зафиксирован перегрев кабеля на расстоянии 230 метров от входа.",
    recommendations: "Необходимо проверить состояние изоляции кабеля и нагрузку на линию.",
  },
]

// Пример данных для событий безопасности
const safetyEvents = [
  {
    id: 1,
    type: "hatch",
    title: "Открытие люка",
    location: "в 335 м от начала",
    time: "Обнаружено в 10:15",
    status: "Активно",
    color: "red",
    severity: "high",
  },
  {
    id: 2,
    type: "movement",
    title: "Движение",
    location: "На расстоянии 260 м",
    time: "Исследн",
    status: "Активно",
    color: "yellow",
    severity: "medium",
  },
  {
    id: 3,
    type: "hatch",
    title: "Открытие люка",
    location: "В 150 м от начала",
    time: "24 апр. 2024",
    status: "Активно",
    color: "red",
    severity: "high",
  },
  {
    id: 4,
    type: "hatch",
    title: "Открытие люка",
    location: "В 120 м от начала",
    time: "24 апр. 2024",
    status: "Активно",
    color: "red",
    severity: "high",
  },
]

// Пример данных для событий офиса
const officeEvents = [
  {
    id: 1,
    type: "overheat",
    title: "Перегрев радиатора 39",
    time: "25 янв. 2024, 10:16",
    status: "Активно",
    color: "orange",
    severity: "medium",
  },
  {
    id: 2,
    type: "overheat",
    title: "Перегрев радиатора 53",
    time: "25 янв. 2024, 09:42",
    status: "Активно",
    color: "orange",
    severity: "medium",
  },
  {
    id: 3,
    type: "door",
    title: "Открытие двери",
    time: "25 янв. 2024, 09:14",
    status: "Активно",
    color: "orange",
    severity: "low",
  },
  {
    id: 4,
    type: "underheat",
    title: "Недостаточный прогрев радиатора 53",
    time: "25 янв. 2024, 07:28",
    status: "Активно",
    color: "orange",
    severity: "low",
  },
]

// Пример данных для событий паркинга
const parkingEvents = [
  {
    id: 1,
    type: "hatch",
    title: "Открытие люка",
    time: "10:48",
    status: "Активно",
    color: "red",
    severity: "high",
  },
  {
    id: 2,
    type: "movement",
    title: "Движение",
    time: "10:32",
    status: "Активно",
    color: "yellow",
    severity: "medium",
  },
  {
    id: 3,
    type: "hatch",
    title: "Открытие люка",
    time: "08:16",
    status: "Активно",
    color: "red",
    severity: "high",
  },
  {
    id: 4,
    type: "movement",
    title: "Движение",
    time: "Вчера, 22:15",
    status: "Активно",
    color: "yellow",
    severity: "medium",
  },
]

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("tech-collectors")
  const [period, setPeriod] = useState("week")

  const hotWaterChartRef = useRef(null)
  const coldWaterChartRef = useRef(null)
  const electricLineChartRef = useRef(null)
  const heatmapRef = useRef(null)

  // Get total events count
  const getTotalEventsCount = () => {
    return techEvents.length + safetyEvents.length + officeEvents.length + parkingEvents.length
  }

  // D3.js chart rendering
  useEffect(() => {
    if (activeTab === "tech-collectors") {
      if (hotWaterChartRef.current) renderLineChart(hotWaterChartRef.current, hotWaterData, [0, 100], "#e11d48")
      if (coldWaterChartRef.current) renderLineChart(coldWaterChartRef.current, coldWaterData, [0, 20], "#2563eb")
      if (electricLineChartRef.current)
        renderLineChart(electricLineChartRef.current, electricLineData, [0, 60], "#eab308")
      if (heatmapRef.current) renderHeatmap(heatmapRef.current, heatmapData)
    }
  }, [activeTab])

  const renderLineChart = (element, data, yDomain, lineColor) => {
    // Clear previous chart
    d3.select(element).selectAll("*").remove()

    // Set dimensions
    const margin = { top: 20, right: 30, bottom: 30, left: 40 }
    const width = element.clientWidth - margin.left - margin.right
    const height = element.clientHeight - margin.top - margin.bottom

    // Create SVG
    const svg = d3
      .select(element)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    // X scale
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.day))
      .range([0, width])
      .padding(0.1)

    // Y scale
    const y = d3.scaleLinear().domain(yDomain).nice().range([height, 0])

    // Add X axis
    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x))

    // Add Y axis
    svg.append("g").call(d3.axisLeft(y))

    // Add grid lines
    svg
      .append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(y).tickSize(-width).tickFormat(""))
      .style("stroke-dasharray", "3,3")
      .style("stroke-opacity", 0.2)

    // Line generator
    const line = d3
      .line()
      .x((d) => x(d.day) + x.bandwidth() / 2)
      .y((d) => y(d.temp))
      .curve(d3.curveMonotoneX)

    // Add the line
    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", lineColor)
      .attr("stroke-width", 2)
      .attr("d", line)

    // Add dots
    svg
      .selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => x(d.day) + x.bandwidth() / 2)
      .attr("cy", (d) => y(d.temp))
      .attr("r", 4)
      .attr("fill", lineColor)
  }

  const renderHeatmap = (element, data) => {
    // Clear previous chart
    d3.select(element).selectAll("*").remove()

    // Set dimensions
    const margin = { top: 20, right: 30, bottom: 50, left: 50 }
    const width = element.clientWidth - margin.left - margin.right
    const height = element.clientHeight - margin.top - margin.bottom

    // Create SVG
    const svg = d3
      .select(element)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    // Get unique distances
    const distances = Array.from(new Set(data.map((d) => d.distance)))

    // X scale (distance)
    const x = d3.scaleLinear().domain([0, 350]).range([0, width])

    // Y scale (day)
    const y = d3.scaleLinear().domain([0, 1]).range([0, height])

    // Color scale
    const colorScale = d3
      .scaleSequential()
      .interpolator(d3.interpolateRdYlBu)
      .domain([d3.max(data, (d) => d.value), d3.min(data, (d) => d.value)])

    // Add X axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(8))
      .append("text")
      .attr("x", width / 2)
      .attr("y", 40)
      .attr("fill", "currentColor")
      .attr("text-anchor", "middle")
      .text("Расстояние, м")

    // Create heatmap cells
    const cellWidth = width / 15
    const cellHeight = height

    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.distance * 25))
      .attr("y", 0)
      .attr("width", cellWidth)
      .attr("height", cellHeight)
      .style("fill", (d) => colorScale(d.value))

    // Add color legend
    const legendWidth = width * 0.6
    const legendHeight = 10
    const legendX = (width - legendWidth) / 2
    const legendY = height + 30

    // Create gradient for legend
    const defs = svg.append("defs")
    const linearGradient = defs
      .append("linearGradient")
      .attr("id", "temperature-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%")

    // Set the color stops
    const minTemp = d3.min(data, (d) => d.value)
    const maxTemp = d3.max(data, (d) => d.value)
    const tempRange = maxTemp - minTemp

    for (let i = 0; i <= 10; i++) {
      const temp = minTemp + (tempRange * i) / 10
      linearGradient
        .append("stop")
        .attr("offset", `${i * 10}%`)
        .attr("stop-color", colorScale(temp))
    }

    // Draw the rectangle with the gradient
    svg
      .append("rect")
      .attr("x", legendX)
      .attr("y", legendY)
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .style("fill", "url(#temperature-gradient)")

    // Add legend axis
    const legendScale = d3.scaleLinear().domain([minTemp, maxTemp]).range([0, legendWidth])

    const legendAxis = d3
      .axisBottom(legendScale)
      .ticks(5)
      .tickFormat((d) => `${d.toFixed(0)}°C`)

    svg
      .append("g")
      .attr("transform", `translate(${legendX}, ${legendY + legendHeight})`)
      .call(legendAxis)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              aria-current={activeTab === tab.id ? "page" : undefined}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Технологи (Коллекторы) */}
      {activeTab === "tech-collectors" && (
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">Технологии</h1>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Обновлено в 10:20</span>
              <EventsCounter count={getTotalEventsCount()} />
              <Button variant="outline" size="sm">
                Обнаформировать отчёт
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Map and Heatmap */}
            <div className="md:col-span-2 space-y-6">
              {/* Map */}
              <Card className="overflow-hidden">
                <div className="h-64 bg-gray-100 relative">
                  {/* Map content */}
                  <div className="absolute inset-0">
                    {/* Red line (hot water) */}
                    <svg width="100%" height="100%" viewBox="0 0 800 600" preserveAspectRatio="none">
                      <path d="M 100 100 L 400 100 L 600 300" stroke="#e11d48" strokeWidth="6" fill="none" />
                      <path d="M 100 200 L 400 200 L 600 400" stroke="#2563eb" strokeWidth="6" fill="none" />
                      <path d="M 400 200 L 700 200" stroke="#eab308" strokeWidth="6" fill="none" />
                      <circle cx="600" cy="300" r="20" fill="rgba(255, 0, 0, 0.2)" />
                      <circle cx="600" cy="300" r="10" fill="#e11d48" />
                    </svg>
                  </div>
                  <div className="absolute bottom-2 right-2 text-xs text-gray-500">Обзорос в 10:20</div>
                </div>
              </Card>

              {/* Heatmap */}
              <Card className="overflow-hidden">
                <div className="h-40" ref={heatmapRef}></div>
              </Card>

              {/* Temperature charts */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-4">
                  <div className="text-sm text-gray-500">Температура ГВС</div>
                  <div className="text-4xl font-bold mt-2">
                    65,2<span className="text-2xl">°C</span>
                  </div>
                  <div className="h-32 mt-4" ref={hotWaterChartRef}></div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm text-gray-500">Температура ХВС</div>
                  <div className="text-4xl font-bold mt-2">
                    9,8<span className="text-2xl">°C</span>
                  </div>
                  <div className="h-32 mt-4" ref={coldWaterChartRef}></div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm text-gray-500">Температура линии электропередачи за неделю</div>
                  <div className="text-4xl font-bold mt-2">
                    42,5<span className="text-2xl">°C</span>
                  </div>
                  <div className="h-32 mt-4" ref={electricLineChartRef}></div>
                </Card>
              </div>
            </div>

            {/* Right column - Events and Temperature indicators */}
            <div className="space-y-6">
              {/* Events */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-medium mb-4">События</h3>
                  <div className="space-y-1">
                    {techEvents.map((event) => (
                      <EventItem key={event.id} event={event} />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Temperature indicators */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="text-4xl font-bold">
                    65,2<span className="text-xl">°C</span>
                  </div>
                  <div className="text-sm text-gray-500">Температура СВа</div>
                  <div className="text-xs text-gray-500 mt-2">Активно</div>
                </Card>
                <Card className="p-4">
                  <div className="text-4xl font-bold">
                    9,8<span className="text-xl">°C</span>
                  </div>
                  <div className="text-sm text-gray-500">iСплевак</div>
                  <div className="text-xs text-gray-500 mt-2">Активно</div>
                </Card>
                <Card className="p-4">
                  <div className="text-4xl font-bold">
                    42,5<span className="text-xl">C</span>
                  </div>
                  <div className="text-sm text-gray-500">Террегревая</div>
                  <div className="text-xs text-gray-500 mt-2">Активно</div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Безопасность (Коллекторы) */}
      {activeTab === "safety-collectors" && (
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Безопасность</h1>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Обновлено в 10:20</span>
              <EventsCounter count={getTotalEventsCount()} />
              <Button variant="outline" size="sm" className="flex items-center">
                <span className="sr-only">Проверено</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </Button>
            </div>
          </div>

          {/* Карта и События */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card className="h-full">
                <div className="h-[500px] bg-gray-100 rounded-md relative">
                  {/* Map content */}
                  <div className="absolute inset-0">
                    {/* Blue line */}
                    <svg width="100%" height="100%" viewBox="0 0 800 600" preserveAspectRatio="none">
                      <path d="M 100 500 L 100 200 L 700 200 L 700 300" stroke="#2563eb" strokeWidth="6" fill="none" />
                      <circle cx="100" cy="500" r="15" fill="#ff4444" />
                      <circle cx="700" cy="300" r="15" fill="#ff4444" />
                    </svg>
                  </div>
                </div>
              </Card>
            </div>

            <div>
              <Card className="h-full">
                <CardContent className="p-4">
                  <h3 className="text-lg font-medium mb-4">События</h3>
                  <div className="space-y-4">
                    {safetyEvents.map((event) => (
                      <EventItem key={event.id} event={event} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Безопасность (Офис) */}
      {activeTab === "safety-office" && (
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Мнемосхема</h1>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">24 апреля 2024 г., 10:20</span>
              <EventsCounter count={getTotalEventsCount()} />
              <Button variant="outline" size="sm">
                Сформировать отчёт
              </Button>
            </div>
          </div>

          {/* Мнемосхема и События */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card className="h-full p-4">
                <h3 className="text-lg font-medium mb-4">10 этаж</h3>
                <div className="relative">
                  <svg width="100%" height="500" viewBox="0 0 800 600" preserveAspectRatio="none">
                    {/* Floor plan */}
                    <rect x="50" y="50" width="700" height="500" fill="none" stroke="#000" strokeWidth="2" />

                    {/* Rooms */}
                    <g>
                      {/* Room 1 */}
                      <rect x="50" y="50" width="150" height="150" fill="none" stroke="#000" strokeWidth="1" />
                      <text x="125" y="125" textAnchor="middle" fontSize="24">
                        46,1
                      </text>

                      {/* Room 2 */}
                      <rect x="200" y="50" width="150" height="150" fill="none" stroke="#000" strokeWidth="1" />
                      <text x="275" y="125" textAnchor="middle" fontSize="24">
                        40,3
                      </text>

                      {/* Room 3 */}
                      <rect x="350" y="50" width="150" height="150" fill="none" stroke="#000" strokeWidth="1" />
                      <text x="425" y="125" textAnchor="middle" fontSize="24">
                        43,4
                      </text>

                      {/* Room 4 */}
                      <rect x="500" y="50" width="100" height="150" fill="none" stroke="#000" strokeWidth="1" />
                      <text x="550" y="125" textAnchor="middle" fontSize="24">
                        37,1
                      </text>

                      {/* Room 5 */}
                      <rect x="600" y="50" width="150" height="150" fill="none" stroke="#000" strokeWidth="1" />
                      <text x="675" y="125" textAnchor="middle" fontSize="24">
                        65,1
                      </text>

                      {/* Room 6 - Radiator */}
                      <rect x="600" y="200" width="150" height="100" fill="none" stroke="#000" strokeWidth="1" />
                      <text x="675" y="230" textAnchor="middle" fontSize="16">
                        Радиатор
                      </text>
                      <text x="675" y="260" textAnchor="middle" fontSize="24">
                        53
                      </text>

                      {/* Alert bubble */}
                      <circle cx="650" y="260" r="25" fill="#ff4444" />
                      <text x="650" y="260" textAnchor="middle" fill="white" fontSize="16">
                        65,1
                      </text>

                      {/* Other rooms */}
                      <rect x="50" y="200" width="150" height="150" fill="none" stroke="#000" strokeWidth="1" />
                      <text x="125" y="250" textAnchor="middle" fontSize="16">
                        Склад
                      </text>
                      <text x="125" y="350" textAnchor="middle" fontSize="16">
                        Септик
                      </text>
                      <text x="125" y="380" textAnchor="middle" fontSize="24">
                        23,1
                      </text>

                      <rect x="200" y="200" width="150" height="150" fill="none" stroke="#000" strokeWidth="1" />
                      <text x="275" y="275" textAnchor="middle" fontSize="24">
                        65,1
                      </text>

                      <rect x="350" y="200" width="150" height="150" fill="none" stroke="#000" strokeWidth="1" />
                      <text x="425" y="250" textAnchor="middle" fontSize="24">
                        38,2
                      </text>
                      <text x="425" y="300" textAnchor="middle" fontSize="16">
                        Радиаторы
                      </text>
                      <text x="425" y="330" textAnchor="middle" fontSize="24">
                        39,2
                      </text>
                    </g>
                  </svg>
                </div>
              </Card>
            </div>

            <div>
              <Card className="h-full">
                <CardContent className="p-4">
                  <h3 className="text-lg font-medium mb-4">События</h3>
                  <div className="space-y-4">
                    {officeEvents.map((event) => (
                      <EventItem key={event.id} event={event} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Пожарная безопасность (Паркинг) */}
      {activeTab === "fire-parking" && (
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Мнемосхема</h1>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">24.04.2024, 10:52</span>
              <EventsCounter count={getTotalEventsCount()} />
            </div>
          </div>

          {/* Мнемосхема и События */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card className="h-full p-4">
                <div className="relative">
                  <svg width="100%" height="500" viewBox="0 0 800 600" preserveAspectRatio="none">
                    {/* Parking layout */}
                    <rect x="50" y="50" width="700" height="500" fill="none" stroke="#000" strokeWidth="2" />

                    {/* Internal walls */}
                    <line x1="50" y1="150" x2="250" y2="150" stroke="#000" strokeWidth="2" />
                    <line x1="250" y1="50" x2="250" y2="250" stroke="#000" strokeWidth="2" />
                    <line x1="250" y1="250" x2="450" y2="250" stroke="#000" strokeWidth="2" />
                    <line x1="450" y1="150" x2="450" y2="350" stroke="#000" strokeWidth="2" />
                    <line x1="450" y1="150" x2="650" y2="150" stroke="#000" strokeWidth="2" />
                    <line x1="650" y1="50" x2="650" y2="250" stroke="#000" strokeWidth="2" />
                    <line x1="250" y1="350" x2="450" y2="350" stroke="#000" strokeWidth="2" />
                    <line x1="250" y1="250" x2="250" y2="450" stroke="#000" strokeWidth="2" />
                    <line x1="50" y1="450" x2="450" y2="450" stroke="#000" strokeWidth="2" />
                    <line x1="450" y1="350" x2="450" y2="550" stroke="#000" strokeWidth="2" />
                    <line x1="450" y1="550" x2="650" y2="550" stroke="#000" strokeWidth="2" />
                    <line x1="650" y1="350" x2="650" y2="550" stroke="#000" strokeWidth="2" />

                    {/* Parking spots */}
                    <g>
                      <rect x="300" y="100" width="30" height="30" fill="#444" />
                      <rect x="500" y="100" width="30" height="30" fill="#444" />
                      <rect x="600" y="100" width="30" height="30" fill="#444" />
                      <rect x="300" y="300" width="30" height="30" fill="#444" />
                      <rect x="500" y="300" width="30" height="30" fill="#444" />
                      <rect x="600" y="300" width="30" height="30" fill="#444" />
                      <rect x="500" y="500" width="30" height="30" fill="#444" />
                    </g>

                    {/* Parking icons */}
                    <g>
                      <circle cx="200" cy="200" r="30" fill="#444" fillOpacity="0.2" />
                      <text x="200" y="205" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">
                        P
                      </text>

                      <circle cx="400" cy="300" r="30" fill="#444" fillOpacity="0.2" />
                      <text x="400" y="305" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">
                        P
                      </text>

                      <circle cx="600" cy="200" r="30" fill="#444" fillOpacity="0.2" />
                      <text x="600" y="205" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">
                        P
                      </text>

                      <circle cx="500" cy="500" r="30" fill="#444" fillOpacity="0.2" />
                      <text x="500" y="505" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">
                        P
                      </text>
                    </g>

                    {/* Arrows */}
                    <path
                      d="M 150 100 C 180 100, 180 70, 150 70"
                      fill="none"
                      stroke="#000"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                    />
                    <path
                      d="M 700 500 L 750 500"
                      fill="none"
                      stroke="#000"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                    />

                    {/* Define arrowhead marker */}
                    <defs>
                      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" />
                      </marker>
                    </defs>
                  </svg>
                </div>
              </Card>
            </div>

            <div>
              <Card className="h-full">
                <CardContent className="p-4">
                  <h3 className="text-lg font-medium mb-4">События</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm font-medium text-gray-500">
                      <span>Событие</span>
                      <span>Время</span>
                    </div>
                    {parkingEvents.map((event) => (
                      <EventItem key={event.id} event={event} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
