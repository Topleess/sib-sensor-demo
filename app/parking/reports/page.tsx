"use client"

import { Calendar, Download, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function ParkingReportsPage() {
  const reports = [
    {
      id: 1,
      name: "Отчет по температуре ГВС",
      date: "24.04.2024",
      type: "PDF",
      size: "1.2 MB",
    },
    {
      id: 2,
      name: "Отчет по температуре ХВС",
      date: "24.04.2024",
      type: "PDF",
      size: "1.1 MB",
    },
    {
      id: 3,
      name: "Отчет по температуре ЭС",
      date: "24.04.2024",
      type: "PDF",
      size: "1.0 MB",
    },
    {
      id: 4,
      name: "Сводный отчет за неделю",
      date: "23.04.2024",
      type: "PDF",
      size: "2.5 MB",
    },
    {
      id: 5,
      name: "Отчет по событиям",
      date: "22.04.2024",
      type: "PDF",
      size: "1.8 MB",
    },
  ]

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Отчеты паркинга</h1>
      <p>Здесь будет отображаться список отчетов паркинга.</p>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Отчеты</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            <span>За неделю</span>
          </Button>
          <Button className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            <span>Сформировать отчет</span>
          </Button>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Название</TableHead>
              <TableHead>Дата</TableHead>
              <TableHead>Тип</TableHead>
              <TableHead>Размер</TableHead>
              <TableHead>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium">{report.name}</TableCell>
                <TableCell>{report.date}</TableCell>
                <TableCell>{report.type}</TableCell>
                <TableCell>{report.size}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Скачать</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
