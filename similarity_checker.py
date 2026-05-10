
from sklearn.feature_extraction.text import TfidfVectorizer
# TfidfVectorizer: converts text into TF-IDF number vectors

from sklearn.metrics.pairwise import cosine_similarity
# cosine_similarity: measures angle between two vectors

import nltk
from nltk.corpus import stopwords

# Download NLTK stopwords (only needed once)
# Stopwords = common words like "the", "is", "and" that add no meaning
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords', quiet=True)


def calculate_similarity(resume_text: str, job_description: str) -> float:
    """
    Takes resume text and job description text.
    Returns a similarity score between 0.0 and 1.0.

    Step-by-step:
    1. Get English stopwords to ignore useless words
    2. Create a TF-IDF Vectorizer
    3. Fit it on both documents (it learns word importance)
    4. Transform both documents into number vectors
    5. Calculate cosine similarity between the two vectors
    6. Return the score
    """

    # Step 1: Get English stopwords
    # These are words like "the", "a", "is" that we want to IGNORE
    stop_words = stopwords.words('english')

    # Step 2: Create TF-IDF Vectorizer
    # stop_words=stop_words → ignore common filler words
    vectorizer = TfidfVectorizer(stop_words=stop_words)

    # Step 3 & 4: Fit and Transform
    # fit_transform() does TWO things at once:
    #   - "fit"      → learns vocabulary and word importance from both texts
    #   - "transform"→ converts both texts into number vectors
    #
    # We pass BOTH texts as a list so the vectorizer learns from both
    tfidf_matrix = vectorizer.fit_transform([resume_text, job_description])
    #
    # tfidf_matrix[0] = vector for resume_text
    # tfidf_matrix[1] = vector for job_description

    # Step 5: Calculate cosine similarity
    # cosine_similarity returns a 2D array like:
    #   [[1.0, 0.82],
    #    [0.82, 1.0]]
    # We want position [0][1] = similarity of doc0 vs doc1
    score = cosine_similarity(tfidf_matrix[0], tfidf_matrix[1])

    # Step 6: Extract the single float value and return it
    # score[0][0] gives us the actual number (e.g., 0.82)
    return float(score[0][0])
