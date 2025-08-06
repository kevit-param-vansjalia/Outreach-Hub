const Contact = require("../models/Contact.model");

const getContact = async (req, res, next) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json({ message: "Contacts found", contacts });
  } catch (err) {
    res.status(500).json({ message: "Error fetching contacts", error: err.message });
  }
};

const addContact = async (req, res, next) => {
  const newContact = new Contact({
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    tags: req.body.tags,
    workspaceId: req.body.workspaceId,
    createdBy: req.user.id,
  });
  await newContact
    .save()
    .then((result) => {
      res
        .status(201)
        .json({ message: "Contact added successfully", contact: result });
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
};


const updateContact = async (req, res, next) => {
  const contactId = req.params.id;

  try {
    const updatedContact = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });

    if (!updatedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json({
      message: "Contact updated successfully",
      updatedContact,
    });
  } catch (err) {
    res.status(400).json({ message: "Error updating contact", error: err.message });
  }
};


const deleteContact = async (req, res, next) => {
    const contactId = req.params.id;
    await Contact.findByIdAndDelete(contactId).then((result) => {
        res.status(200).json({ message: "Contact deleted successfully" });
    }).catch( err => {
        res.status(400).json({ message: err.message });
    });
   
    };


module.exports = { getContact, addContact, updateContact, deleteContact };
