"use client"

import type React from "react"
import { useState } from "react"
import { Home, Calculator, TrendingUp, MapPin, Eye, Droplets, Building, Calendar, Square, Layers } from "lucide-react"
import "./App.css"

// Type definitions
interface FormData {
  bedrooms: number
  bathrooms: number
  sqft_living: number
  sqft_lot: number
  floors: number
  waterfront: number
  view: number
  condition: number
  sqft_above: number
  sqft_basement: number
  yr_built: number
}

interface SelectOption {
  value: number
  label: string
}

interface FieldConfig {
  icon: React.ComponentType<{ className?: string }>
  label: string
  type: "number" | "select"
  min?: number
  max?: number
  step?: number
  options?: SelectOption[]
}

interface ApiResponse {
  data: {
    prediction: number
  }
}

// API configuration
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

// API call
const apiCall = async (formData: FormData): Promise<ApiResponse> => {
  const res = await fetch(`${API_URL}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`)
  }

  const data = await res.json()
  return { data }
}

export default function App() {
  const [form, setForm] = useState<FormData>({
    bedrooms: 3,
    bathrooms: 2,
    sqft_living: 1800,
    sqft_lot: 5000,
    floors: 1,
    waterfront: 0,
    view: 0,
    condition: 3,
    sqft_above: 1800,
    sqft_basement: 0,
    yr_built: 2000,
  })

  const [prediction, setPrediction] = useState<number | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fieldConfig: Record<keyof FormData, FieldConfig> = {
    bedrooms: {
      icon: Home,
      label: "Kamar Tidur",
      type: "number",
      min: 1,
      max: 10,
    },
    bathrooms: {
      icon: Droplets,
      label: "Kamar Mandi",
      type: "number",
      min: 1,
      max: 8,
      step: 0.5,
    },
    sqft_living: {
      icon: Square,
      label: "Luas Hunian (sqft)",
      type: "number",
      min: 500,
      max: 10000,
    },
    sqft_lot: {
      icon: MapPin,
      label: "Luas Tanah (sqft)",
      type: "number",
      min: 1000,
      max: 50000,
    },
    floors: {
      icon: Layers,
      label: "Jumlah Lantai",
      type: "number",
      min: 1,
      max: 4,
    },
    waterfront: {
      icon: Droplets,
      label: "Tepi Air",
      type: "select",
      options: [
        { value: 0, label: "Tidak" },
        { value: 1, label: "Ya" },
      ],
    },
    view: {
      icon: Eye,
      label: "Kualitas Pemandangan",
      type: "select",
      options: Array.from({ length: 5 }, (_, i) => ({
        value: i,
        label: i === 0 ? "Tidak Ada" : `Level ${i}`,
      })),
    },
    condition: {
      icon: Building,
      label: "Kondisi Rumah",
      type: "select",
      options: Array.from({ length: 5 }, (_, i) => ({
        value: i + 1,
        label: `${i + 1} - ${["Buruk", "Kurang", "Rata-rata", "Baik", "Sangat Baik"][i]}`,
      })),
    },
    sqft_above: {
      icon: Square,
      label: "Luas Lantai Atas (sqft)",
      type: "number",
      min: 0,
      max: 10000,
    },
    sqft_basement: {
      icon: Square,
      label: "Luas Basement (sqft)",
      type: "number",
      min: 0,
      max: 5000,
    },
    yr_built: {
      icon: Calendar,
      label: "Tahun Dibangun",
      type: "number",
      min: 1900,
      max: 2024,
    },
  }

  const handleChange = (name: keyof FormData, value: string) => {
    setForm({ ...form, [name]: Number(value) })
    // Clear error when user changes input
    if (error) setError(null)
  }

  const isFormValid = () => {
    return Object.entries(form).every(([key, value]) => {
      const config = fieldConfig[key as keyof FormData]
      if (config.min !== undefined && value < config.min) return false
      if (config.max !== undefined && value > config.max) return false
      return true
    })
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    setPrediction(null)

    try {
      const res = await apiCall(form)
      setPrediction(res.data.prediction)
    } catch (err) {
      console.error(err)
      setError("Gagal mendapatkan prediksi. Pastikan server backend berjalan di " + API_URL)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number): string => {
    const kurs = 16000 // 1 USD = 16.000 IDR
    const idr = amount * kurs
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(idr)
  }

  return (
    <div className="app-container">
      {/* Header */}
      <div className="header">
        <div className="header-content">
          <div className="header-info">
            <div className="header-icon">
              <Home className="icon" />
            </div>
            <div>
              <h1 className="header-title">Prediksi Harga Rumah</h1>
              <p className="header-subtitle">Estimasi harga properti dengan teknologi AI</p>
            </div>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="content-wrapper">
          {/* Form */}
          <div className="form-card">
            <h2 className="form-title">
              <Building className="form-title-icon" />
              Detail Properti
            </h2>

            <div className="form-grid">
              {(Object.entries(form) as [keyof FormData, number][]).map(([key, value]) => {
                const config = fieldConfig[key]
                const Icon = config.icon

                return (
                  <div key={key} className="form-field">
                    <label className="field-label">
                      <Icon className="field-icon" />
                      {config.label}
                    </label>

                    {config.type === "select" && config.options ? (
                      <select
                        value={value}
                        onChange={(e) => handleChange(key, e.target.value)}
                        className="field-select"
                      >
                        {config.options.map((option: SelectOption) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="number"
                        value={value}
                        onChange={(e) => handleChange(key, e.target.value)}
                        min={config.min}
                        max={config.max}
                        step={config.step || 1}
                        className="field-input"
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Submit Button */}
          <div className="submit-container">
            <button onClick={handleSubmit} disabled={loading || !isFormValid()} className="submit-button">
              <div className="button-content">
                {loading ? (
                  <>
                    <div className="loading-spinner" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <Calculator className="button-icon" />
                    Prediksi Harga
                  </>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-card">
            <p className="error-message">{error}</p>
          </div>
        )}

        {/* Result */}
        {prediction && (
          <div className="result-card">
            <div className="result-content">
              <div className="result-icon-container">
                <div className="result-icon">
                  <TrendingUp className="trending-icon" />
                </div>
              </div>
              <h3 className="result-title">Estimasi Harga Properti</h3>
              <div className="result-price">{formatCurrency(prediction)}</div>
              <p className="result-description">
                Estimasi ini berdasarkan data historis dan karakteristik properti yang Anda masukkan. Harga aktual dapat
                bervariasi tergantung kondisi pasar.
              </p>
            </div>
          </div>
        )}

        {/* Info Cards */}
        <div className="info-cards">
          <div className="info-card">
            <div className="info-card-header">
              <div className="info-icon blue">
                <Calculator className="info-icon-svg" />
              </div>
              <h4 className="info-title">Akurat</h4>
            </div>
            <p className="info-description">Menggunakan algoritma machine learning untuk prediksi yang akurat</p>
          </div>

          <div className="info-card">
            <div className="info-card-header">
              <div className="info-icon purple">
                <TrendingUp className="info-icon-svg" />
              </div>
              <h4 className="info-title">Real-time</h4>
            </div>
            <p className="info-description">Prediksi berdasarkan data pasar terkini dan tren properti</p>
          </div>

          <div className="info-card">
            <div className="info-card-header">
              <div className="info-icon green">
                <Home className="info-icon-svg" />
              </div>
              <h4 className="info-title">Komprehensif</h4>
            </div>
            <p className="info-description">Mempertimbangkan berbagai faktor yang mempengaruhi harga</p>
          </div>
        </div>
      </div>
    </div>
  )
}
