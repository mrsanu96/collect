import connectToDatabase from '../../lib/mongodb';
import FormDataModel from '../../model/account';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await connectToDatabase(); // Connect to MongoDB
      const { username, email, description, website, facebook, twitter, instagram } = req.body;
      const formData = new FormDataModel({ username, email, description, website, facebook, twitter, instagram });
      await formData.save(); // Save form data to MongoDB
      res.status(200).json({ message: 'Form submitted successfully' });
    } catch (error) {
      console.error('Error submitting form:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}