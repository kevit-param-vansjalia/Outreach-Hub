const Contact = require("../models/Contact.model");

const getContact = async (req, res, next) => {
  const userId = req.body.user_id;

  const contacts = await User.find({ user_id: userId });

  res.status(200).json(contacts);
};

const addContact = async (req, res, next) => {
  const newContact = new Contact({
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    tags: req.body.tags,
    workspaceId: req.body.workspaceId,
    createdBy: req.body.userId,
  });
  await newContact
    .save()
    .then((res) => {
      res
        .status(201)
        .json({ message: "Contact added successfully", contact: newContact });
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
};

const updateContact = async (req, res, next) => {
    const contactId = req.params._id;
    const contact = await Contact.findByIdAndUpdate(contactId, req.body, { new: true }).then((res) => {
        res.status(200).json({message: "Contact updated successfully", contact});
    }).catch(err => {
        res.status(400).json({message: err.message});
    });

        res.status(200).json({message: "Contact updated successfully", contact});
        };

const deleteContact = async (req, res, next) => {
    const contactId = req.params._id;
    await Contact.findByIdAndDelete(contactId).then((res) => {
        res.status(200).json({ message: "Contact deleted successfully" });
    }).catch( err => {
        res.status(400).json({ message: err.message });
    });
   
    };


module.exports = { getContact, addContact, updateContact, deleteContact };
