const Card = require("./mongodb/Card");
const { handleBadRequest } = require("../../utils/errorHandler");
const config = require("config");

const DB = config.get("DB");

const find = async () => {
  if (DB === "MONGODB") {
    try {
      const cards = await Card.find();
      return Promise.resolve(cards);
    } catch (error) {
      error.status = 404;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve("get cards not in mongodb");
};

const findMyCards = async (userId) => {
  if (DB === "MONGODB") {
    try {
      const cards = await Card.find({ user_id: userId });
      return Promise.resolve(cards);
    } catch (error) {
      error.status = 404;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve("get card not in mongodb");
};

const findLikedCards = async (userId) => {
  if (DB === "MONGODB") {
    try {
      const cards = await Card.find({ likes: userId });
      return Promise.resolve(cards);
    } catch (error) {
      error.status = 404;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve("get liked cards not in mongodb");
};

const findOne = async (cardId) => {
  if (DB === "MONGODB") {
    try {
      let card = await Card.findById(cardId);
      if (!card) throw new Error("Could not find this card in the database");
      return Promise.resolve(card);
    } catch (error) {
      error.status = 404;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve("get card not in mongodb");
};

const create = async (normalizedCard) => {
  if (DB === "MONGODB") {
    try {
      const {email} = normalizedCard;
      let card = await Card.findOne({email})
      if(card) throw new Error("Email already exists")
      card = new Card(normalizedCard);
      card = await card.save();
      return Promise.resolve(card);
    } catch (error) {
      error.status = 400;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve("createCard card not in mongodb");
};

const update = async (cardId, normalizedCard) => {
  if (DB === "MONGODB") {
    try {
      let card = await Card.findByIdAndUpdate(cardId, normalizedCard, {
        new: true,
      });

      if (!card)
        throw new Error("A card with this ID cannot be found in the database");

      return Promise.resolve(card);
    } catch (error) {
      error.status = 400;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve("card updateCard not in mongodb");
};

const like = async (cardId, userId) => {
  if (DB === "MONGODB") {
    try {
      let card = await Card.findById(cardId);
      if (!card)
        throw new Error("A card with this ID cannot be found in the database");

      const cardLikes = card.likes.find((id) => id === userId);

      if (!cardLikes) {
        card.likes.push(userId);
        card = await card.save();
        return Promise.resolve(card);
      }

      const cardFiltered = card.likes.filter((id) => id !== userId);
      card.likes = cardFiltered;
      card = await card.save();
      return Promise.resolve(card);
    } catch (error) {
      error.status = 400;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve("card likeCard not in mongodb");
};

const remove = async (cardId, user) => {
  if (DB === "MONGODB") {
    try {
      let card = await Card.findById(cardId);

      if (!card)
        throw new Error("A card with this ID cannot be found in the database");

      if (!user.isAdmin && user._id.toString() !== card.user_id.toString())
        throw new Error(
          "Authorization Error: Only the user who created the business card or admin can delete this card"
        );

      card = await Card.findByIdAndDelete(cardId);

      return Promise.resolve(card);
    } catch (error) {
      error.status = 400;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve("card deleted not in mongodb");
};

exports.find = find;
exports.findMyCards = findMyCards;
exports.findLikedCards = findLikedCards;
exports.findOne = findOne;
exports.create = create;
exports.update = update;
exports.like = like;
exports.remove = remove;
