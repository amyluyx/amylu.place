export default function AboutPage() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-gray-100 to-gray-300 text-black">
      <h1 className="text-4xl font-bold">About Me</h1>
      <div className="mt-4 text-lg max-w-xl text-center space-y-4">
        <p>
          Hi, I’m Amy — a UW engineering student building at the intersection of hardware, software, and real-world systems.
        </p>
        <p>
          I study Electrical &amp; Computer Engineering, Applied &amp; Computational Math, and Informatics, and I spend most of my time working on projects involving embedded systems, data pipelines, and complex technical infrastructure. I’m deeply involved in UW Formula Motorsports, where I work on telemetry systems for a high-performance electric race car, including CAN pipelines, networking, data logging, and real-time dashboards.
        </p>
        <p>
          I also care a lot about community-building and design. Through CSEED Buildspace, I help create spaces where students can explore ideas, build real projects, and grow confidence through hands-on work. I like projects where technical rigor meets creativity and human impact.
        </p>
        <p>
          I’m especially interested in roles involving embedded systems, data engineering, applied ML, and technical product work.
        </p>
      </div>
    </div>
  );
}