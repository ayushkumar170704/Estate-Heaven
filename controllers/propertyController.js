const Property = require('../models/Property');
const fs = require('fs');

exports.createProperty = async (req, res) => {
  try {
    const property = await Property.create({
      ...req.body,
      image: req.file?.path,
      postedBy: req.user.id
    });
    res.status(201).json(property);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProperties = async (req, res) => {
  const properties = await Property.find().populate('postedBy', 'username');
  res.json(properties);
};

exports.getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('postedBy', 'username');
    if (!property) return res.status(404).json({ error: 'Property not found' });
    res.json(property);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ error: 'Not found' });
    if (property.postedBy.toString() !== req.user.id)
      return res.status(403).json({ error: 'Unauthorized' });

    if (req.file && property.image) fs.unlinkSync(property.image); // delete old image

    const updatedData = {
      ...req.body,
      image: req.file ? req.file.path : property.image
    };

    const updated = await Property.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ error: 'Not found' });
    if (property.postedBy.toString() !== req.user.id)
      return res.status(403).json({ error: 'Unauthorized' });

    if (property.image) fs.unlinkSync(property.image); // delete image
    await property.remove();

    res.json({ message: 'Property deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
