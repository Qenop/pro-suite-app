// src/pages/CreatePropertyPage.jsx
import PropertyForm from '../forms/PropertyForm';

const CreatePropertyPage = () => {
  const handleSubmit = (formData) => {
    console.log('Submitted Property:', formData);
    alert('Form submitted — check console for data.');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4">Create Property</h2>
      <PropertyForm mode="create" onSubmit={handleSubmit} />
    </div>
  );
};

export default CreatePropertyPage;
