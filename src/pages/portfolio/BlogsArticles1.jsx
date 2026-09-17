import avatarFallback from "../../assets/images/portfolio/blogs/Ellipse 2.png";
import SelectDropdown from "../../components/common/SelectDropdown";
import BlogCard from "../../components/portfolio/Blogs/BlogCard";
import BlogPagination from "../../components/portfolio/Blogs/BlogPagination";
import { POSTS_PER_PAGE } from "../../config/wordpress";
import useBlogFeed from "../../hooks/useBlogFeed";

export default function BlogsArticles1() {
  const {
    posts,
    reports,
    categories,
    page,
    setPage,
    setCategory,
    totalPages,
    total,
    loading,
    error,
  } = useBlogFeed();

  const categoryItems = ["All Categories", ...categories.map((c) => c.name)];

  const handleCategoryChange = (name) => {
    if (name === "All Categories") {
      setCategory(null);
      return;
    }
    const match = categories.find((c) => c.name === name);
    setCategory(match?.id ?? null);
  };

  const handlePageChange = (nextPage) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-[90vw] mx-auto">
      <section>
        <div className=" my-[10vh] gap-[6vh]  flex flex-col-reverse items-center md:flex-row!">
          <div className="flex-1 text-center md:text-left!">
            <h2 className="text-lg md:text-[2.3rem]! font-medium mb-4">
              Blogs{" "}
              <span className="text-[#0c7bb3] font-semibold">& Articles</span>
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed text-justify px-3 md:px-0!">
              Creatrend is a vibrant and growing team of creative
              professionals, all about supporting creators and businesses across
              the world with genuine and impactful User-Generated Content. We
              work together remotely from various locations in the world, which
              helps us to bring a rich mix of ideas and talents to our mission.
              We are excited to empower our community and make a difference
              together! One thing we all have in common is our passion for what
              we do!
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-lg md:text-[2.3rem]! font-medium">
            Our Latest{" "}
            <span className="text-[#0c7bb3] font-semibold">Articles</span>
          </h2>
          <SelectDropdown
            label="Categories"
            items={categoryItems}
            onChange={handleCategoryChange}
          />
        </div>
      </section>

      <section className="flex justify-between">
        <div className="mb-20">
          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          {loading ? (
            <p className="text-gray-500 text-sm">Loading articles...</p>
          ) : posts.length === 0 ? (
            <p className="text-gray-500 text-sm">No articles found.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2! gap-6 ">
                {posts.map((blog) => (
                  <BlogCard
                    key={blog.id}
                    media={blog.image}
                    title={blog.title}
                    author={blog.author}
                    avatar={blog.avatar || avatarFallback}
                    description={blog.excerpt}
                    to={`/blogs-articles/${blog.id}`}
                  />
                ))}
              </div>

              <BlogPagination
                page={page}
                totalPages={totalPages}
                total={total}
                perPage={POSTS_PER_PAGE}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>

        <div className="hidden md:block! w-[35%] ml-10 top-20 p-5 bg-[#FFFCF0] rounded-2xl h-fit custom-scrollbar">
          <h3 className="font-medium mb-4">
            Our <span className="text-[#0c7bb3] font-semibold">Reports</span>
          </h3>
          {reports.map((blog) => (
            <BlogCard
              key={blog.id}
              media={blog.image}
              title={blog.title}
              to={`/blogs-articles/${blog.id}`}
              className=""
            />
          ))}
        </div>
      </section>
    </div>
  );
}
