import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-white text-black">
      <div className="absolute top-8 left-8 text-black">
        <Link to="/" className="underline cursor-pointer hover:text-gray-600">
          Back
        </Link>
      </div>
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] text-gray-600 flex gap-4">
        <a href="mailto:amyluyx@uw.edu" className="underline">email</a>
        <a href="https://linkedin.com/in/amyluyx" target="_blank" rel="noreferrer" className="underline">linkedin</a>
        <a href="/resume.pdf" className="underline">resume</a>
      </div>
      <h1 className="text-4xl font-bold">About Me</h1>
      <div className="mt-4 text-sm max-w-xl text-center space-y-3 leading-tight">
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
        <div className="pt-6 text-left space-y-3 text-xs leading-tight">
          <h2 className="text-xl font-semibold">Skills</h2>

          <div className="space-y-1">
            <h3 className="font-medium">Programming & Software</h3>
            <p>Python, Java, C/C++, SQL, SystemVerilog, JavaScript · ROS2, Docker, Git, Linux · APIs, data pipelines</p>
          </div>

          <div className="space-y-1">
            <h3 className="font-medium">Embedded & Hardware</h3>
            <p>CAN, UART, I2C, SPI · Raspberry Pi, Jetson, ESP32 · PCB debug, scopes, soldering</p>
          </div>

          <div className="space-y-1">
            <h3 className="font-medium">Data & Tools</h3>
            <p>InfluxDB, Grafana, SQLite · Logging systems · ML workflows · LaTeX</p>
          </div>

          <div className="space-y-1">
            <h3 className="font-medium">Design & Creative</h3>
            <p>Figma, Photoshop · Webflow, Shopify · Piano, viola, jazz guitar</p>
          </div>

        </div>
      </div>
    </div>
  );
}