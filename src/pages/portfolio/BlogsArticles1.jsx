import img1 from "../../assets/images/portfolio/blogs/Background.png";
import img2 from "../../assets/images/portfolio/blogs/Background_2.png";
import img3 from "../../assets/images/portfolio/blogs/Background_3.png";
import blog_img1 from "../../assets/images/portfolio/blogs/Blog_1.png";
import blog_img2 from "../../assets/images/portfolio/blogs/Blog_2.png";
import avatar1 from "../../assets/images/portfolio/blogs/Ellipse 2.png";
import SelectDropdown from "../../components/common/SelectDropdown";
import withPagination from "../../components/common/withPagination";
import BlogCard from "../../components/portfolio/Blogs/BlogCard";
img1;
export default function BlogsArticles1() {
  const categories = ["Blogs", "News", "Commentary", "Press", "Events"];
  const blogs = [
    {
      media: img1,
      author: "John Doe",
      avatar: avatar1,
      title:
        "Unleashing the Benefits of UGC For Creators & Brands with Creatrend",
      description:
        "Exploring the advancements in AI, VR, and more that are shaping our world. Creatrend is a vibrant and growing team of creative professionals, all about supporting creators and businesses across the world with genuine and impactful User-Generated Content. We work together remotely from various locations in the world, which helps us to bring a rich mix of ideas and talents to our mission. We are excited to empower our community and make a difference together! One thing we all have in common is our passion for what we do!",
    },
    {
      media: img2,
      author: "Jane Smith",
      avatar: avatar1,
      title: "The Future of Work: Embracing Remote Collaboration",
      description:
        "As the world shifts towards remote work, it's essential to understand the tools and strategies that can enhance collaboration. This article explores the best practices for remote teamwork and how Creatrend is at the forefront of this revolution.",
    },
    {
      media: img3,
      author: "Jane Smith",
      avatar: avatar1,
      title: "The Future of Work: Embracing Remote Collaboration",
      description:
        "As the world shifts towards remote work, it's essential to understand the tools and strategies that can enhance collaboration. This article explores the best practices for remote teamwork and how Creatrend is at the forefront of this revolution.",
    },
    {
      media: img1,
      author: "Jane Smith",
      avatar: avatar1,
      title: "The Future of Work: Embracing Remote Collaboration",
      description:
        "As the world shifts towards remote work, it's essential to understand the tools and strategies that can enhance collaboration. This article explores the best practices for remote teamwork and how Creatrend is at the forefront of this revolution.",
    },
    {
      media: img2,
      author: "Jane Smith",
      avatar: avatar1,
      title: "The Future of Work: Embracing Remote Collaboration",
      description:
        "As the world shifts towards remote work, it's essential to understand the tools and strategies that can enhance collaboration. This article explores the best practices for remote teamwork and how Creatrend is at the forefront of this revolution.",
    },
    {
      media: img3,
      author: "Jane Smith",
      avatar: avatar1,
      title: "The Future of Work: Embracing Remote Collaboration",
      description:
        "As the world shifts towards remote work, it's essential to understand the tools and strategies that can enhance collaboration. This article explores the best practices for remote teamwork and how Creatrend is at the forefront of this revolution.",
    },
  ];

  const blogs2 = [
    {
      media: blog_img1,
      author: "John Doe",
      avatar: avatar1,
      title:
        "Unleashing the Benefits of UGC For Creators & Brands with Creatrend",
      description:
        "Exploring the advancements in AI, VR, and more that are shaping our world. Creatrend is a vibrant and growing team of creative professionals, all about supporting creators and businesses across the world with genuine and impactful User-Generated Content. We work together remotely from various locations in the world, which helps us to bring a rich mix of ideas and talents to our mission. We are excited to empower our community and make a difference together! One thing we all have in common is our passion for what we do!",
    },
    {
      media: blog_img2,
      author: "Jane Smith",
      avatar: avatar1,
      title: "The Future of Work: Embracing Remote Collaboration",
      description:
        "As the world shifts towards remote work, it's essential to understand the tools and strategies that can enhance collaboration. This article explores the best practices for remote teamwork and how Creatrend is at the forefront of this revolution.",
    },
    {
      media: blog_img1,
      author: "Jane Smith",
      avatar: avatar1,
      title: "The Future of Work: Embracing Remote Collaboration",
      description:
        "As the world shifts towards remote work, it's essential to understand the tools and strategies that can enhance collaboration. This article explores the best practices for remote teamwork and how Creatrend is at the forefront of this revolution.",
    },
  ];

  function BlogList({ items }) {
    return (
      <>
        {items.map((blog, index) => (
          <BlogCard
            key={index}
            media={blog.media}
            title={blog.title}
            author={blog.author}
            avatar={blog.avatar}
            description={blog.description}
            to={`/blogs/${index}`}
          />
        ))}
      </>
    );
  }
  const PaginatedBlogList = withPagination(
    BlogList,
    6,
    "grid grid-cols-1 md:grid-cols-2! gap-6 "
  );
  return (
    <div className="max-w-[90vw] mx-auto">
      <section>
        <div className=" my-[10vh] gap-[6vh]  flex flex-col-reverse items-center md:flex-row!">
          {/* Text Section */}
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
            items={categories}
            onChange={(val) => console.log("Selected:", val)}
          />
        </div>
      </section>
      <section className="flex justify-between">
        <div className="mb-20">
          {Object.keys(blogs).length > 0 && (
            <PaginatedBlogList items={[...blogs, ...blogs.reverse()]} />
          )}
        </div>
        <div className="hidden md:block! w-[35%] ml-10 top-20 p-5 bg-[#FFFCF0] rounded-2xl h-fit custom-scrollbar">
          <h3 className="font-medium mb-4">
            Our <span className="text-[#0c7bb3] font-semibold">Reports</span>
          </h3>
          {Object.keys(blogs2).length > 0 &&
            blogs2.map((blog, index) => (
              <BlogCard
                key={index}
                media={blog.media}
                title={blog.title}
                to={`/blogs/${index}`}
                className=""
              />
            ))}
        </div>
      </section>
    </div>
  );
}
