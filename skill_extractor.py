

# ── Master Skill List ────────────────────────────────────────
# This is your skill dictionary. You can add more skills here!
SKILL_LIST = [
    # Programming Languages
    "python", "java", "c++", "c#", "javascript", "typescript",
    "ruby", "go", "rust", "kotlin", "swift", "r", "scala",
    "php", "bash", "shell", "perl", "matlab",

    # Web Development
    "html", "css", "react", "angular", "vue", "node.js", "nodejs",
    "express", "django", "flask", "fastapi", "spring boot", "springboot",
    "jquery", "bootstrap", "tailwind", "next.js", "nextjs",

    # Databases
    "sql", "mysql", "postgresql", "mongodb", "sqlite", "oracle",
    "redis", "cassandra", "dynamodb", "firebase",

    # Cloud & DevOps
    "aws", "azure", "gcp", "google cloud", "docker", "kubernetes",
    "jenkins", "terraform", "ansible", "ci/cd", "linux", "git",
    "github", "gitlab", "bitbucket",

    # Data Science & ML
    "machine learning", "deep learning", "data analysis", "data science",
    "pandas", "numpy", "matplotlib", "seaborn", "scikit-learn",
    "tensorflow", "keras", "pytorch", "nlp", "computer vision",
    "tableau", "power bi", "excel", "statistics",

    # Other Tech
    "api", "rest api", "graphql", "microservices", "agile", "scrum",
    "jira", "figma", "photoshop", "hadoop", "spark", "kafka",
]


def extract_skills(text: str) -> set:
    """
    Takes a block of text (resume or job description)
    and returns a SET of skills found in it.

    A 'set' in Python is like a list but with NO duplicates.
    Example: {"Python", "SQL", "AWS"}

    How it works:
    1. Convert text to lowercase
    2. Loop through every skill in our master list
    3. Check if that skill appears anywhere in the text
    4. If yes, add it to our results set
    """
    # Step 1: Lowercase the text for case-insensitive matching
    text_lower = text.lower()

    # Step 2: Create an empty set to store found skills
    found_skills = set()

    # Step 3: Loop through each skill in our master list
    for skill in SKILL_LIST:
        # Check if the skill word is inside the text
        # "in" operator checks for substring presence
        if skill in text_lower:
            # Capitalize nicely for display: "python" → "Python"
            found_skills.add(skill.title())

    return found_skills
