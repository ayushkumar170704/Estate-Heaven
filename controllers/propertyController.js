const Property = require('../models/Property');
const cloudinary = require('cloudinary').v2;

const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find().populate('createdBy', 'username email');
    res.status(200).json(properties);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch properties' });
  }
};

const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.status(200).json(property);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving property' });
  }
};

const createProperty = async (req, res) => {
  const { title, description, price, address } = req.body;

  if (!req.files || !req.files.image) {
    return res.status(400).json({ message: 'Image is required' });
  }

  try {
    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
      folder: 'properties',
    });

    const newProperty = new Property({
      title,
      description,
      price,
      address,
      image: result.secure_url, // Store Cloudinary URL
      createdBy: req.user.id,
    });

    await newProperty.save();
    res.status(201).json({ message: 'Property created', property: newProperty });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create property' });
  }
};

const updateProperty = async (req, res) => {
  const { title, description, price, address } = req.body;
  const { id } = req.params;

  try {
    const property = await Property.findById(id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    if (req.user.id !== property.createdBy.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this property' });
    }

    // Update image if provided
    if (req.files && req.files.image) {
      const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
        folder: 'properties',
      });
      property.image = result.secure_url; // Replace old image URL
    }

    property.title = title || property.title;
    property.description = description || property.description;
    property.price = price || property.price;
    property.address = address || property.address;

    await property.save();
    res.status(200).json({ message: 'Property updated', property });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update property' });
  }
};

const deleteProperty = async (req, res) => {
  const { id } = req.params;

  try {
    const property = await Property.findById(id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    if (req.user.id !== property.createdBy.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this property' });
    }

    await property.deleteOne();
    res.status(200).json({ message: 'Property deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete property' });
  }
};

module.exports = {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
};