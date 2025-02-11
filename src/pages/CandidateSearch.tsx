import { useState, useEffect } from 'react';
import { searchGithub, searchGithubUser } from '../api/API'; // Corrected import path
import { Candidate } from '../interfaces/Candidate.interface'; // Corrected import path

const CandidateSearch = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [currentCandidateIndex, setCurrentCandidateIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [savedCandidates, setSavedCandidates] = useState<Candidate[]>([]);
  const [currentCandidateDetails, setCurrentCandidateDetails] = useState<Candidate | null>(null);

  // Fetch a list of candidates (page of users)
  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true);
      const fetchedCandidates = await searchGithub();
      setCandidates(fetchedCandidates);
      setLoading(false);
    };

    fetchCandidates();
  }, []);

  // Fetch saved candidates from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('savedCandidates');
    if (savedData) {
      setSavedCandidates(JSON.parse(savedData));
    }
  }, []);

  const handleSaveCandidate = async () => {
    const currentCandidate = candidates[currentCandidateIndex];

    if (currentCandidate) {
      try {
        const userDetails = await searchGithubUser(currentCandidate.login);
        //console.log('User details:', userDetails);
        // Add user details to the saved candidates
        setCurrentCandidateDetails(userDetails);
        
        if (userDetails) {
        const updatedSavedCandidates = [...savedCandidates, userDetails];
        setSavedCandidates(updatedSavedCandidates);
        
        // Save to localStorage
        localStorage.setItem('savedCandidates', JSON.stringify(updatedSavedCandidates));

        // Move to the next candidate
        setCurrentCandidateIndex((prevIndex) => prevIndex + 1);
        }
      } catch (err) {
        console.error('Error fetching user details:', err);
      }
    }
  };

  const handleSkipCandidate = () => {
    setCurrentCandidateIndex((prevIndex) => prevIndex + 1);
  };

  const currentCandidate = candidates[currentCandidateIndex];

  return (
    <div>
      {loading ? (
        <p>Loading candidates...</p>
      ) : candidates.length === 0 ? (
        <p>No more candidates available</p>
      ) : (
        <div>
          <div>
            <img
              src={currentCandidate?.avatar_url}
              alt="Avatar"
              width={250}
              height={250}
              />
              <h2>{currentCandidate?.login}</h2>
            {currentCandidateDetails && (
              <div>
                <p><strong>GitHub Profile:</strong> <a href={currentCandidate?.html_url} target="_blank" rel="noopener noreferrer">Profile Link</a></p>
                <p><strong>Location:</strong> {currentCandidateDetails.location || 'N/A'}</p>
                <p><strong>Email:</strong> {currentCandidateDetails.email || 'N/A'}</p>
                <p><strong>Company:</strong> {currentCandidateDetails.company || 'N/A'}</p>
                <p><strong>Bio:</strong> {currentCandidateDetails.bio || 'N/A'}</p>
              </div>
            )}
            <div>
              <button onClick={handleSaveCandidate}>Save Candidate (+)</button>
              <button onClick={handleSkipCandidate}>Skip Candidate (-)</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateSearch;