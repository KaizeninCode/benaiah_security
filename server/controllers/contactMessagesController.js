/*
CRUD operations for Contact Messages

POST /contact-messages - Create a new contact message
GET /contact-messages - Retrieve all contact messages
GET /contact-messages/:id - Retrieve a specific contact message by ID
DELETE /contact-messages/:id - Delete a specific contact message by ID
*/
import ContactMessage from "../models/ContactMessage.js";
export const createContactMessage = async (req, res) => {
  const { firstName, lastName, email, phoneNumber, message } = req.body;

  if (!firstName || !lastName || !email || !phoneNumber || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const newMessage = new ContactMessage({
      firstName,
      lastName,
      email,
      phoneNumber,
      message,
    });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: "Failed to create contact message." });
  }
};

export const getAllContactMesssages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to retrieve contact messages." });
  }
};

export const getOneContactMessage = async(req, res) => {
    const {id} = req.params
    try {
       const message = await ContactMessage.findById(id)
       if(!message){
        return res.status(404).json({error: "Contact message not found."})
       } 
       res.status(200).json(message)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Failed to retrieve the contact message." });
    }
}

export const deleteContactMessage = async(req,res) => {
    const {id} = req.params
    try {
       const message = await ContactMessage.findByIdAndDelete(id)
       if(!message){
        return res.status(404).json({error: "Contact message not found."})
       } 
       res.status(200).json({message: "Contact message deleted successfully."})
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Failed to delete the contact message." });
    }
}
