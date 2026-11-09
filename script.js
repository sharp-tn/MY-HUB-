
    const passwordInput = document.getElementById("loginPassword");
    const togglePassword = document.getElementById("togglePassword");

    if (passwordInput && togglePassword) {
        togglePassword.addEventListener("click", function () {
            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                togglePassword.textContent = "HIDE";
            } else {
                passwordInput.type = "password";
                togglePassword.textContent = "SHOW";
            }
        });
    }

    const loginForm = document.getElementById("loginForm");
    const loginMessage = document.getElementById("loginMessage");


    // ===== LOGIN SYSTEM =====

    if (loginForm) {

        loginForm.addEventListener("submit", function(event) {

            event.preventDefault();

            const email = document.getElementById("loginEmail").value.trim();
            const password = passwordInput.value;

            const users = JSON.parse(localStorage.getItem("myHubUsers")) || [];

            const account = users.find(user =>
                user.email === email && user.password === password
            );

            if (!account) {
                loginMessage.textContent = "Incorrect email or password.";
                loginMessage.style.color = "#ff6b8a";
                return;
            }

            localStorage.setItem("myHubLoggedIn", account.email);

            loginMessage.textContent = "Welcome back, " + account.username + "!";

            loginMessage.style.color = "#a855f7";

            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);

        });

    }


    // ===== SIGN UP SYSTEM =====

    const signupForm = document.getElementById("signupForm");

    if (signupForm) {

        signupForm.addEventListener("submit", function(event) {

            event.preventDefault();

            const username = document.getElementById("signupUsername").value.trim();
            const email = document.getElementById("signupEmail").value.trim();
            const password = document.getElementById("signupPassword").value;
            const confirm = document.getElementById("confirmPassword").value;
            const message = document.getElementById("signupMessage");

            if (password.length < 6) {
                message.textContent = "Password must contain at least 6 characters.";
                message.style.color = "#ff6b8a";
                return;
            }

            if (password !== confirm) {
                message.textContent = "Passwords do not match.";
                message.style.color = "#ff6b8a";
                return;
            }

            const users = JSON.parse(localStorage.getItem("myHubUsers")) || [];

            if (users.some(user => user.email === email)) {
                message.textContent = "This email is already registered.";
                message.style.color = "#ff6b8a";
                return;
            }

            users.push({
                username: username,
                email: email,
                password: password
            });

            localStorage.setItem("myHubUsers", JSON.stringify(users));

            message.textContent = "Account created successfully!";
            message.style.color = "#a855f7";

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);

        });

    }
    console.log("MY HUB protection script is running");
    const currentPage = window.location.pathname;

    if (currentPage.endsWith("index.html") || currentPage.endsWith("/")) {
        const loggedInUser = localStorage.getItem("myHubLoggedIn");

        if (!loggedInUser) {
            window.location.href = "login.html";
        }
    }
    function logout() {
        localStorage.removeItem("myHubLoggedIn");
        window.location.href = "login.html";
    }
    const welcomeUser = document.getElementById("welcomeUser");

    if (welcomeUser) {
        const loggedInEmail = localStorage.getItem("myHubLoggedIn");
        const users = JSON.parse(localStorage.getItem("myHubUsers")) || [];

        const account = users.find(user => user.email === loggedInEmail);

        if (account) {
            welcomeUser.textContent = "Welcome back, " + account.username + "!";
        }
    }
    const profileUsername = document.getElementById("profileUsername");
    const profileEmail = document.getElementById("profileEmail");
    const profileAvatar = document.getElementById("profileAvatar");

    if (profileUsername && profileEmail) {
        const loggedInEmail = localStorage.getItem("myHubLoggedIn");
        const users = JSON.parse(localStorage.getItem("myHubUsers")) || [];

        const account = users.find(user => user.email === loggedInEmail);

        if (account) {
            profileUsername.textContent = account.username;
            profileEmail.textContent = account.email;
            profileAvatar.textContent = account.username.charAt(0).toUpperCase();
        }
    }
    const goalList = document.getElementById("goalList");
    const newGoalInput = document.getElementById("newGoalInput");
    const addGoalBtn = document.getElementById("addGoalBtn");

    if (goalList && newGoalInput && addGoalBtn) {
        addGoalBtn.addEventListener("click", function () {
            const goalText = newGoalInput.value.trim();

            if (goalText === "") {
                return;
            }

            const goalItem = document.createElement("div");
            goalItem.className = "goal-item";

            goalItem.innerHTML = `
                <span class="goal-pending"></span>
                <div>
                    <strong></strong>
                    <small>Personal goal</small>
                </div>
            `;

            goalItem.querySelector("strong").textContent = goalText;
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "×";
    deleteBtn.className = "delete-goal";
    deleteBtn.type = "button";

    goalItem.appendChild(deleteBtn);
            goalList.appendChild(goalItem);
            newGoalInput.value = "";
        });
    }
    if (goalList) {
        goalList.addEventListener("click", function(event) {
            if (event.target.classList.contains("delete-goal")) {
        event.target.closest(".goal-item").remove();
        return;
    }
            const goalItem = event.target.closest(".goal-item");

            if (!goalItem) return;

            const marker = goalItem.querySelector(
                ".goal-check, .goal-pending"
            );

            if (!marker) return;

            if (marker.classList.contains("goal-check")) {
                marker.classList.replace("goal-check", "goal-pending");
                marker.textContent = "";
            } else {
                marker.classList.replace("goal-pending", "goal-check");
                marker.textContent = "✓";

                addActivity(
        "Completed a goal",
        goalItem.querySelector("strong").textContent
    );
            }
        });
    }
    if (goalList) {

        function saveGoals() {
            const goals = [];

            goalList.querySelectorAll(".goal-item").forEach(item => {
                goals.push({
                    title: item.querySelector("strong").textContent,
                    category: item.querySelector("small").textContent,
                    completed: item.querySelector(".goal-check") !== null
                });
            });

            localStorage.setItem("myHubGoals", JSON.stringify(goals));
        }

        function createGoal(title, category, completed) {
            const item = document.createElement("div");
            item.className = "goal-item";

            item.innerHTML = `
                <span class="${completed ? "goal-check" : "goal-pending"}">
                    ${completed ? "✓" : ""}
                </span>
                <div>
                    <strong></strong>
                    <small></small>
                </div>
            `;

            item.querySelector("strong").textContent = title;
            item.querySelector("small").textContent = category;

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "×";
            deleteBtn.className = "delete-goal";
            deleteBtn.type = "button";

            item.appendChild(deleteBtn);

            return item;
        }

        const savedGoals = JSON.parse(localStorage.getItem("myHubGoals"));

        if (savedGoals) {
            goalList.innerHTML = "";

            savedGoals.forEach(goal => {
                goalList.appendChild(
                    createGoal(goal.title, goal.category, goal.completed)
                );
            });
        } else {
            goalList.querySelectorAll(".goal-item").forEach(item => {
                if (!item.querySelector(".delete-goal")) {
                    const btn = document.createElement("button");
                    btn.textContent = "×";
                    btn.className = "delete-goal";
                    btn.type = "button";
                    item.appendChild(btn);
                }
            });

            saveGoals();
        }

        goalList.addEventListener("click", saveGoals);

        addGoalBtn.addEventListener("click", saveGoals);
    }
    const projectList = document.querySelector(".projects-grid");
    const newProjectInput = document.getElementById("newProjectInput");
    const addProjectBtn = document.getElementById("addProjectBtn");

    if (projectList && newProjectInput && addProjectBtn) {
        addProjectBtn.addEventListener("click", function () {
            const projectName = newProjectInput.value.trim();

            if (projectName === "") return;

            const project = document.createElement("article");
            project.className = "project-card future-card";

            project.innerHTML = `
                <div class="project-visual">
                    <div class="future-symbol">✧</div>
                    <span class="future-text">NEW PROJECT</span>
                </div>
                <div class="project-info">
                    <div class="project-meta">
                        <span class="project-category">PERSONAL</span>
                        <span class="project-status">PLANNING</span>
                    </div>
                    <h3></h3>
                    <p>A new project in progress.</p>
                </div>
            `;

            project.querySelector("h3").textContent = projectName;
        const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "×";
    deleteBtn.className = "delete-project";
    deleteBtn.type = "button";

    project.querySelector(".project-info").appendChild(deleteBtn);

    projectList.appendChild(project);
    saveProjects();
    addActivity("Created a new project", projectName);
            newProjectInput.value = "";
        });
    }
    function saveProjects() {
        const projects = [];

        document.querySelectorAll(".projects-grid .project-card").forEach(card => {
            projects.push({
                title: card.querySelector("h3").textContent,
                description: card.querySelector("p").textContent
            });
        });

        localStorage.setItem("myHubProjects", JSON.stringify(projects));
    }
    if (projectList) {
        const savedProjects = JSON.parse(
            localStorage.getItem("myHubProjects")
        ) || [];

        savedProjects.forEach(saved => {
            const alreadyExists = [...projectList.querySelectorAll("h3")]
                .some(title => title.textContent === saved.title);

            if (alreadyExists) return;

            const project = document.createElement("article");
            project.className = "project-card future-card";

            project.innerHTML = `
                <div class="project-visual">
                    <div class="future-symbol">✧</div>
                    <span class="future-text">SAVED PROJECT</span>
                </div>
                <div class="project-info">
                    <div class="project-meta">
                        <span class="project-category">PERSONAL</span>
                        <span class="project-status">PLANNING</span>
                    </div>
                    <h3></h3>
                    <p></p>
                </div>
            `;

            project.querySelector("h3").textContent = saved.title;
            project.querySelector("p").textContent = saved.description;

            projectList.appendChild(project);
        });
    }
    if (projectList) {
        projectList.addEventListener("click", function(event) {
            if (event.target.classList.contains("delete-project")) {
                event.target.closest(".project-card").remove();
                saveProjects();
            }
        });
    }
    function addActivity(title, description) {
        const activityList = document.getElementById("activityList");

        if (!activityList) return;

        const item = document.createElement("div");
        item.className = "activity-item";

        item.innerHTML = `
            <div class="activity-icon purple-icon">✦</div>
            <div>
                <strong></strong>
                <small></small>
            </div>
            <span class="activity-time">NOW</span>
        `;

        item.querySelector("strong").textContent = title;
        item.querySelector("small").textContent = description;

        const savedActivities = JSON.parse(
        localStorage.getItem("myHubActivity")
    ) || [];

    savedActivities.unshift({
        title: title,
        description: description
    });

    savedActivities.splice(5);

    localStorage.setItem(
        "myHubActivity",
        JSON.stringify(savedActivities)
    );

    activityList.prepend(item);

        const activities = activityList.querySelectorAll(".activity-item");

        if (activities.length > 5) {
            activities[activities.length - 1].remove();
        }
    }
    const activityList = document.getElementById("activityList");

    if (activityList) {
        const savedActivities = JSON.parse(
            localStorage.getItem("myHubActivity")
        ) || [];

        savedActivities.forEach(activity => {
            const item = document.createElement("div");
            item.className = "activity-item";

            item.innerHTML = `
                <div class="activity-icon purple-icon">✦</div>
                <div>
                    <strong></strong>
                    <small></small>
                </div>
                <span class="activity-time">SAVED</span>
            `;

            item.querySelector("strong").textContent = activity.title;
            item.querySelector("small").textContent = activity.description;

            activityList.appendChild(item);
        });
    }