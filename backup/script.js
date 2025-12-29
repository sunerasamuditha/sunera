// script.js

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Sticky Header Scroll Behavior
let lastScrollY = window.scrollY;
const header = document.querySelector(".header-area");

window.addEventListener("scroll", () => {
  if (window.scrollY > lastScrollY) {
    header.classList.add("header-hidden"); // Hide on scroll down
  } else {
    header.classList.remove("header-hidden"); // Show on scroll up
  }
  lastScrollY = window.scrollY;
});

// Mobile Menu Toggle
const menuTrigger = document.querySelector(".menu-trigger");
const navMenu = document.querySelector(".nav");

menuTrigger.addEventListener("click", () => {
  navMenu.classList.toggle("show");
});

// Close menu when clicking outside
document.addEventListener('click', (event) => {
    if (!menuTrigger.contains(event.target) && !navMenu.contains(event.target)) {
      navMenu.classList.remove('show');
    }
  });



//work

document.addEventListener("DOMContentLoaded", () => {
    const companies = document.querySelectorAll(".companies li");
    const detailsTitle = document.querySelector(".details h3");
    const detailsDate = document.querySelector(".details .date");
    const detailsList = document.querySelector(".details ul");
  
    // Data for companies
    const data = {
        learny: {
            title: "Project Manager @ LEARNY",
            date: "August 24 - Present",
            points: [
              "Led the development and implementation of LEARNY, a user-friendly online learning platform, utilizing Bootstrap templates and integrating multiple databases to enhance functionality.",
              "Collaborated with a team of four to design and deploy key features, including course management and instructor interfaces, ensuring robust functionality and user experience.",
              "Oversaw the project's end-to-end lifecycle, from initial concept and design to final delivery, meeting academic requirements and user expectations.",
              "Facilitated effective communication among team members, ensuring alignment with project goals and deadlines.",
            ],
          },
          rekaira: {
            title: "Founder and CCO @ Reka Ira Media",
            date: "Oct 23 - Present",
            points: [
              "Established Reka Ira Media to innovate and produce impactful digital and traditional media content.",
              "Directed creative strategies and content production, aligning with emerging market trends to achieve organizational goals.",
              "Managed cross-functional teams, fostering collaboration between designers, developers, and marketers to deliver high-quality campaigns.",
              "Built strong client relationships and identified new opportunities to expand the company’s reach and influence.",
            ],
          },
          stem: {
            title: "National Coordinator, STEM Education @ Sasnaka Sansada Foundation",
            date: "March 24 - Present",
            points: [
              "Coordinated the nationwide Ganitha Saviya project, benefiting over 80,000 students annually through 1,300+ seminars in 25 districts.",
              "Designed and maintained technical dashboards to monitor and report project progress effectively.",
              "Organized training programs for educators and volunteers, enhancing the impact of STEM education initiatives.",
              "Collected and analyzed feedback to optimize the delivery of educational content and improve student outcomes.",
            ],
          },
          leader: {
            title: "Resource Person, Leadership and Grooming @ Sasnaka Sansada Foundation",
            date: "April 23 - Present",
            points: [
              "Conducted leadership training sessions to empower youth with essential soft skills and grooming techniques.",
              "Developed interactive workshops that foster team building and individual growth.",
              "Worked closely with foundation teams to align training objectives with organizational goals.",
              "Mentored participants, inspiring confidence and cultivating a sense of responsibility and excellence.",
            ],
          },
          popcorn: {
            title: "Facilitator, @ Popcorn Teams",
            date: "Sept 23 - Present",
            points: [
              "Delivered corporate training programs focused on team building and organizational development.",
              "Designed engaging activities and exercises to improve communication and collaboration among participants.",
              "Provided actionable feedback and strategies to enhance team performance and dynamics.",
              "Built strong rapport with corporate clients to ensure the programs met specific organizational needs.",
            ],
          },
          drysmart: {
            title: "Project Lead @ DrySmart+",
            date: "March 24 - Present",
            points: [
              "Spearheaded the development of DrySmart+, an IoT-powered smart drying system designed to ensure weather-safe clothes drying.",
"Led a multidisciplinary team to design and implement features such as real-time weather monitoring, automated rain detection, and energy-efficient mechanisms.",
"Oversaw project planning, prototype development, and testing phases to deliver a user-centric, reliable solution.",
"Facilitated collaboration between team members, ensuring timely execution and alignment with project objectives.",
            ],
          },
    
    };
  
    // Event listener for switching details dynamically
    companies.forEach((company) => {
      company.addEventListener("click", () => {
        // Remove the active class from previously active item
        const activeItem = document.querySelector(".companies .active");
        if (activeItem) activeItem.classList.remove("active");
  
        // Add the active class to the clicked item
        company.classList.add("active");
  
        // Get the company name from the data-role attribute
        const role = company.dataset.role;
  
        // Update the details section
        if (data[role]) {
          detailsTitle.innerHTML = data[role].title;
          detailsDate.textContent = data[role].date;
          detailsList.innerHTML = data[role].points
            .map((point) => `<li>${point}</li>`)
            .join("");
        }
      });
    });
  
    // Initialize with the first company (Upstatement)
    document.querySelector(".companies li[data-role='Upstatement']").click();
  });

  // You can add interactivity here if needed. For now, this is a placeholder.
console.log("Projects section loaded!");

// Placeholder for interactivity (if needed)
console.log("Noteworthy Projects section loaded!");

// Add interactivity if needed (e.g., scrolling animations or responsive behavior)
console.log("Navigation bar loaded!");

const skills = document.querySelector('.skills');

// Pause animation on hover
document.querySelector('.skills-banner').addEventListener('mouseenter', () => {
  skills.style.animationPlayState = 'paused';
});

// Resume animation when hover ends
document.querySelector('.skills-banner').addEventListener('mouseleave', () => {
  skills.style.animationPlayState = 'running';
});

  document.addEventListener('DOMContentLoaded', function () {
    const dropdownButton = document.querySelector('.dropdown-button');
    const companiesMenu = document.querySelector('.companies');

    dropdownButton.addEventListener('click', function () {
      // Toggle the visibility of the companies menu
      companiesMenu.style.display = companiesMenu.style.display === 'block' ? 'none' : 'block';
    });
  });



  



  
