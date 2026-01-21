import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { FiFilter } from "react-icons/fi"

import Footer from "../components/common/Footer"
import Course_Card from "../components/core/Catalog/Course_Card"
import Course_Slider from "../components/core/Catalog/Course_Slider"
import { apiConnector } from "../services/apiconnector"
import { categories } from "../services/apis"
import { getCatalogPageData } from "../services/operations/pageAndComponntDatas"
import Error from "./Error"

function Catalog() {
  const { loading } = useSelector((state) => state.profile)
  const { catalogName } = useParams()
  const [active, setActive] = useState(1)
  const [catalogPageData, setCatalogPageData] = useState(null)
  const [categoryId, setCategoryId] = useState("")
  
  // Fetch All Categories
  useEffect(() => {
    ;(async () => {
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API)
        console.log("Categories API response:", res)
        
        // Handle the response - data is an array directly
        const categoriesData = res?.data?.data
        console.log("Categories data:", categoriesData)
        console.log("Catalog name from URL:", catalogName)
        
        if (categoriesData && Array.isArray(categoriesData)) {
          const matchedCategory = categoriesData.find(
            (ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName
          )
          console.log("Matched category:", matchedCategory)
          
          if (matchedCategory) {
            setCategoryId(matchedCategory._id)
          } else {
            console.log("No category found matching:", catalogName)
          }
        }
      } catch (error) {
        console.log("Could not fetch Categories.", error)
      }
    })()
  }, [catalogName])
  
  useEffect(() => {
    if (categoryId) {
      ;(async () => {
        try {
          const res = await getCatalogPageData(categoryId)
          setCatalogPageData(res)
        } catch (error) {
          console.log(error)
        }
      })()
    }
  }, [categoryId])

  if (loading || !catalogPageData) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center bg-richblack-900">
        <div className="spinner"></div>
      </div>
    )
  }
  
  if (!loading && !catalogPageData.success) {
    return <Error />
  }

  return (
    <div className="bg-richblack-900">
      {/* Hero Section with Gradient */}
      <div className="relative bg-gradient-to-br from-richblack-800 via-richblack-900 to-richblack-900 px-4">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="relative mx-auto flex min-h-[280px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent py-12">
          <div className="flex items-center gap-2 text-sm text-richblack-300">
            <span className="hover:text-yellow-50 cursor-pointer transition-colors">Home</span>
            <span>/</span>
            <span className="hover:text-yellow-50 cursor-pointer transition-colors">Catalog</span>
            <span>/</span>
            <span className="text-yellow-50 font-medium">
              {catalogPageData?.data?.selectedCategory?.name}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-richblack-5">
            {catalogPageData?.data?.selectedCategory?.name}
          </h1>
          <p className="max-w-[870px] text-base text-richblack-200 leading-relaxed">
            {catalogPageData?.data?.selectedCategory?.description}
          </p>
          <div className="flex items-center gap-4 mt-4">
            <div className="px-4 py-2 rounded-lg bg-richblack-700 border border-richblack-600">
              <span className="text-sm text-richblack-200">
                {catalogPageData?.data?.selectedCategory?.courses?.length || 0} Courses Available
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: Featured Courses */}
      <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-richblack-5">
            Courses to get you started
          </h2>
        </div>
        
        <div className="flex items-center gap-6 mb-8 border-b border-richblack-700">
          <button
            className={`px-4 py-3 text-base font-medium transition-all ${
              active === 1
                ? "border-b-2 border-yellow-50 text-yellow-50"
                : "text-richblack-200 hover:text-richblack-5"
            }`}
            onClick={() => setActive(1)}
          >
            Most Popular
          </button>
          <button
            className={`px-4 py-3 text-base font-medium transition-all ${
              active === 2
                ? "border-b-2 border-yellow-50 text-yellow-50"
                : "text-richblack-200 hover:text-richblack-5"
            }`}
            onClick={() => setActive(2)}
          >
            New Releases
          </button>
        </div>
        
        {/* Display 5 courses in grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {catalogPageData?.data?.selectedCategory?.courses
            ?.slice(0, 5)
            .map((course, i) => (
              <Course_Card course={course} key={i} Height={"h-[200px]"} />
            ))}
        </div>
      </div>

      {/* Section 2: Top Courses in Different Category */}
      <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent bg-richblack-800">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-richblack-5 mb-2">
            Top courses in {catalogPageData?.data?.differentCategory?.name}
          </h2>
          <p className="text-richblack-300">
            Expand your skills with these highly-rated courses
          </p>
        </div>
        
        {/* Display 5 courses in grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {catalogPageData?.data?.differentCategory?.courses
            ?.slice(0, 5)
            .map((course, i) => (
              <Course_Card course={course} key={i} Height={"h-[200px]"} />
            ))}
        </div>
      </div>

      {/* Section 3: Frequently Bought Together */}
      <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-richblack-5 mb-2">
            Frequently Bought Together
          </h2>
          <p className="text-richblack-300">
            Students who bought these courses also purchased
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {catalogPageData?.data?.mostSellingCourses
            ?.slice(0, 6)
            .map((course, i) => (
              <Course_Card course={course} key={i} Height={"h-[220px]"} />
            ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Catalog
