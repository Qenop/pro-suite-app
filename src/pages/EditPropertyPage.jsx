//src\pages\EditPropertyPage.jsx
import { useParams } from 'react-router-dom';
import PropertyForm from '../forms/PropertyForm';
import { useEffect, useState } from 'react';
import axios from '../services/api';

const EditPropertyPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);

  useEffect(() => {
    axios.get(`/properties/${id}`)
      .then(res => setProperty(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!property) return <p>Loading...</p>;

  return (
    <div>
      <h2>Edit Property</h2>
      <PropertyForm mode="edit" initialValues={property} />
    </div>
  );
};

export default EditPropertyPage;
