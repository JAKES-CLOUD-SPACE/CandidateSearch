import { useState, useEffect } from 'react';
import { searchGithub, searchGithubUser } from '../api/API'; // Corrected import path
import { Candidate } from '../interfaces/Candidate.interface'; // Corrected import path

const CandidateSearch = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [currentCandidateIndex, setCurrentCandidateIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [savedCandidates, setSavedCandidates] = useState<Candidate[]>([]);
  const [fullCandidateDetails, setFullCandidateDetails] = useState<Candidate[]>([]); // Store full candidate details

  // Fetch a list of candidates (page of users)
  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true);

      try {
        // Step 1: Fetch basic candidate list
        const fetchedCandidates = await searchGithub();
        setCandidates(fetchedCandidates);

        // Step 2: Fetch full details for each candidate
        const fullDetailsPromises = fetchedCandidates.map(async (candidate: Candidate) => {
          const details = await searchGithubUser(candidate.login);
          console.log(details);
          return details || null; // Handle case if user details are missing
        });
        
        // Step 3: Wait for all full details to be fetched
        const fullDetails = await Promise.all(fullDetailsPromises);

        // Step 4: Update state with full candidate details
        setFullCandidateDetails(fullDetails);
      } catch (error) {
        console.error('Error fetching candidates:', error);
      } finally {
        setLoading(false);
      }
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
  const currentFullDetails = fullCandidateDetails[currentCandidateIndex];

  return (
    <div>
      {loading ? (
        <p>Loading candidates...</p>
      ) : candidates.length === 0 ? (
        <p>No more candidates available</p>
      ) : (
        <div>
          <h1>Candidate Search</h1>
          <div>
            <img
              src={currentCandidate?.avatar_url}
              alt="Avatar"
              width={250}
              height={250}
              />
              <h2>{currentCandidate?.login}</h2>
              {currentFullDetails ? (
              <div>
                <p><strong>Location:</strong> {currentFullDetails.location || 'N/A'}</p>
                <p><strong>Email:</strong> {currentFullDetails.email || 'N/A'}</p>
                <p><strong>GitHub Profile:</strong> <a href={currentFullDetails.html_url} target="_blank" rel="noopener noreferrer">Profile Link</a></p>
                <p><strong>Company:</strong> {currentFullDetails.company || 'N/A'}</p>
                <p><strong>Bio:</strong> {currentFullDetails.bio || 'N/A'}</p>
              </div>
              ) : (
                <p>No full details available</p>
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