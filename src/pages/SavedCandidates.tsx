
import { useState, useEffect } from 'react';
import { Candidate } from '../interfaces/Candidate.interface';

const SavedCandidates = () => {
  const [savedCandidates, setSavedCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [filter, setFilter] = useState({
    name: '',
    email: '',
  });

  // Fetch saved candidates from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('savedCandidates');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setSavedCandidates(parsedData);
      setFilteredCandidates(parsedData); // Initially show all saved candidates
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('savedCandidates', JSON.stringify(savedCandidates));
  }, [savedCandidates]);

  // Handle the rejection of a candidate (removing them from the list)
  const handleReject = (username: string) => {
    const updatedCandidates = savedCandidates.filter(
      (candidate) => candidate.login !== username
    );
    setSavedCandidates(updatedCandidates);
    setFilteredCandidates(updatedCandidates); // Keep the filtered candidates in sync
  };

  // Filter candidates based on filter criteria
  useEffect(() => {
    const filtered = savedCandidates.filter((candidate) => {
      return (
        (filter.name ? candidate.login?.toLowerCase().includes(filter.name.toLowerCase()) : true) &&
        (filter.email ? candidate.email?.toLowerCase().includes(filter.email.toLowerCase()) : true) 
      );
    });
    setFilteredCandidates(filtered);
  }, [filter, savedCandidates]);

  // Handle filter input change
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => ({
      ...prevFilter,
      [name]: value,
    }));
  };

  return (
    <div>
      <h1>Saved Candidates</h1>
      
      {/* Filter bar */}
      <div className="filter-bar">
        <input
          type="text"
          name="name"
          placeholder="Filter by Name"
          value={filter.name || ''}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="email"
          placeholder="Filter by Email"
          value={filter.email}
          onChange={handleFilterChange}
        />
      </div>

      {filteredCandidates.length === 0 ? (
        <p>No candidates match the filter criteria.</p>
      ) : (
        <table className="candidates-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Location</th>
              <th>Email</th>
              <th>Company</th>
              <th>Bio</th>
              <th>Reject</th>
            </tr>
          </thead>
          <tbody>
            {filteredCandidates.map((candidate: Candidate) => (
              <tr key={candidate.login}>
                <td>
                  <img
                    src={candidate.avatar_url}
                    alt="Avatar"
                    width={50}
                    height={50}
                  />
                </td>
                <td>{candidate.login}</td>
                <td>{candidate.location || 'N/A'}</td>
                <td>{candidate.email || 'N/A'}</td>
                <td>{candidate.company || 'N/A'}</td>
                <td>{candidate.bio || 'N/A'}</td>
                <td>
                  <button onClick={() => handleReject(candidate.login)}>
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SavedCandidates;
