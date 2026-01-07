import { useArticle } from "../../store/useArticleStore"
import { useEffect, useState } from "react"
import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
const Article = () => {

  const { getAllArticles, articleContainer } = useArticle()
  const [searchValue, setSearchValue] = useState("")




  if (articleContainer !== null) {
    console.log(articleContainer)
  }








  useEffect(() => {
    getAllArticles()
  }, [])
  return (
    <main className="mt-20 p-6 w-full h-100vh ">

      {/*Article Page Header */}

      <section className="flex flex-col gap-4 w-full  items-center justify-center  ">
        {/* Text Space */}
        <div className=" flex flex-col gap-4 items-center justify-center p-12 ">
          <p className=" text-4xl font-bold tracking-wide "> Tax Learning Library </p>
          <p className="text-gray-500 text-2xl  tracking-wide">Bite-sized articles to help you understand Nigerian taxes </p>
        </div >


        {/* Input Space */}
        <div className="w-full">
          <input
            className="w-full border border-gray-300 rounded-md p-3 bg-gray-50"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search Value"
          />
        </div>

      </section>

      {/* articles space  */}
      <p className="mt-4">Showing {articleContainer?.totalArticles} articles </p>
      <section className="grid md:grid-cols-3 lg:grid-cols-3 gap-6 mt-4">
        {articleContainer?.data.map(d => (
          <div
            key={d._id}
            className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm transition-all duration-300 hover:border-green-500 hover:shadow-md"
          >
            <div className="flex justify-between items-center mb-3">
              <div className="bg-gray-100 text-gray-700 text-sm px-2 py-1 rounded-full">
                {d.articleCategory.name}
              </div>
              <p className="text-gray-500 text-sm">{d.timeTaken} min read</p>
            </div>

            <h2 className="text-lg font-semibold text-gray-800 transition-colors duration-300 hover:text-green-600">
              {d.title}
            </h2>

            <p className="text-gray-600 mt-2">{d.description}</p>

            <div className="flex items-center  mt-5 hover:text-green-600 gap-2">
              <Link to={`/article/${d._id}`} className="hover:text-green-600  ">
                read more
              </Link>

              <ArrowRight className="hover:text-green-600 " size={20}/>
            </div>

          </div>
        ))}
      </section>





    </main>
  )
}

export default Article
