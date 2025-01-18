import BlogDetailContent from "./components/BlogDetailContainer";
import BlogDetailSidebar from "./components/BlogDetailSidebar";

const BlogDetailContainer = () => {
  return (
    <>
      <section className="overflow-hidden py-10 px-32">
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <BlogDetailContent />
            <BlogDetailSidebar />
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogDetailContainer;
