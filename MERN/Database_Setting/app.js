const mongoose = require("mongoose")
const Grid = require('gridfs-stream');
const fs = require('fs');
const bcrypt = require('bcryptjs')
require('dotenv').config();


const musicSchema = new mongoose.Schema({
  music_name: String,
  category: String,
  composer: String,
  description: String,
  price: Number,
  published: String,
  new_arrival: Boolean,
  music_image: String,
  music_clip: String
})

const userSchema = new mongoose.Schema({
  first_name: {type: String, default: null},
  last_name: {type: String, default: null},
  email: {type: String, unique: true},
  password: {type: String},
  invoice: [{type: mongoose.Schema.ObjectId, ref: "Invoice"}]
})

const User = mongoose.model('User', userSchema);
const Music = mongoose.model('Music', musicSchema);

const invoiceSchema = new mongoose.Schema({
  full_name: {type: String, default: null, required: true},
  company_name: {type: String, default: null},
  address_1: {type: String, default: null, required: true},
  address_2: {type: String, default: null},
  city: {type: String, default: null, equired: true},
  region: {type: String, default: null},
  country: {type: String, default: null, required: true},
  postcode: {type: String, default: null, required: true},
  user_ref: { type: mongoose.ObjectId, ref: User },
  orderedMusics: [{ music_ref: {type: mongoose.ObjectId, ref: 'Music'}, music_name: {type: String, default: 0}, price: {type: Number, default: 0}, quantity: { type: Number, default: 0} }]
})

const Invoice = mongoose.model('Invoice', invoiceSchema);

const musicData = [
  {
    music_name: "Symphony No. 41 Jupiter, 1st Movement Allegro Vivace",
    category: "Classical",
    composer: "Wolfgang Amadeus Mozart",
    description: "Jupiter Symphony, byname of Symphony No. 41 in C Major, K 551, orchestral work by Austrian composer Wolfgang Amadeus Mozart, known for its good humour, exuberant energy, and unusually grand scale for a symphony of the Classical period.",
    price: 30,
    published: "1788",
    new_arrival: true,
    music_image: "img_1.jpg",
    music_clip: "m1.mp3"
  },
  {
    music_name: "Scherzo: Allegro vivace con delicatezza",
    category: "Classical",
    composer: "Schubert, Franz",
    description: "In the first part of the Classical period, the dance movement, when it appeared, usually consisted of a minuet in fairly simple binary form (the two-part form from which sonata form evolved)...",
    price: 80,
    published: "1828",
    new_arrival: false,
    music_image: "img_2.jpg",
    music_clip: "m2.mp3"
  },
  {
    music_name: "Bach, J.S.: Goldberg Variations, BWV 988",
    category: "Baroque",
    composer: "J.S. Bach",
    description: "On his visits to Dresden, Bach had won the regard of the Russian envoy, Hermann Karl, Reichsgraf (count) von Keyserlingk, who commissioned the so-called Goldberg Variations; these were published in 1741...",
    price: 100,
    published: "1741",
    new_arrival: false,
    music_image: "img_3.jpg",
    music_clip: "m3.mp3"
  },
  {
    music_name: "Mussorgsky, Modest: Night on Bald Mountain",
    category: "Classical",
    composer: "Classical",
    description: "Night on Bald Mountain, Russian Noch na lysoy gore, also called Night on Bare Mountain, orchestral work by the Russian composer Modest Mussorgsky that was completed in June 1867...",
    price: 40,
    published: "1867",
    new_arrival: false,
    music_image: "img_4.jpg",
    music_clip: "m4.mp3"
  },
  {
    music_name: "Claudio Monteverdi's Madrigals",
    category: "Baroque",
    composer: "Claudio Monteverdi's Madrigals",
    description: "Claudio Giovanni Antonio Monteverdi was an Italian composer, gambist, singer and Roman Catholic priest. Monteverdi's work, often regarded as revolutionary, marked the transition from the Renaissance style of music to that of the Baroque period...",
    price: 200,
    published: "1587-1651",
    new_arrival: false,
    music_image: "img_5.jpg",
    music_clip: "m5.mp3"
  },
  {
    music_name: "Bach: Concerto No. 1 in D Major",
    category: "Baroque",
    composer: "Bach",
    description: "Baroque music, a style of music that prevailed during the period from about 1600 to about 1750, known for its grandiose, dramatic, and energetic spirit but also for its stylistic diversity...",
    price: 140,
    published: "1791",
    new_arrival: false,
    music_image: "img_6.jpg",
    music_clip: "m6.mp3"
  },
  {
    music_name: "Frederic Chopin: Piano Concerto No. 1 in E Minor",
    category: "Romantic",
    composer: "Frederic Chopin",
    description: "A second concert confirmed his success, and on his return home he prepared himself for further achievements abroad by writing his Piano Concerto No. 2 in F Minor (1829) and his Piano Concerto No. 1 in E Minor (1830)...",
    price: 130,
    published: "1830",
    new_arrival: false,
    music_image: "img_7.jpg",
    music_clip: "m7.mp3"
  },
  {
    music_name: "Franz Liszt: Christus",
    category: "Late 19th",
    composer: "Franz Liszt",
    description: "For the next eight years Liszt lived mainly in Rome and occupied himself more and more with religious music. He completed the oratorios Die Legende von der heiligen Elisabeth (1857-62) and Christus (1855-66) and a number of smaller works...",
    price: 199,
    published: "1855-1866",
    new_arrival: false,
    music_image: "img_8.jpg",
    music_clip: "m8.mp3"
  },
  {
    music_name: "Claude Debussy: Children's Corner",
    category: "Romantic",
    composer: "Claude Debussy",
    description: "Repelled by the gossip and scandal arising from this situation, he sought refuge for a time at Eastbourne, on the south coast of England. For his daughter, nicknamed Chouchou, he wrote the piano suite Children's Corner (1908)...",
    price: 149,
    published: "1908",
    new_arrival: false,
    music_image: "img_9.jpg",
    music_clip: "m9.mp3"
  },
  {
    music_name: "Robert Schumann: Papillons",
    category: "Romantic",
    composer: "Robert Schumannr",
    description: "In the summer of 1829 he left Leipzig for Heidelberg. There he composed waltzes in the style of Franz Schubert, afterward used in his piano cycle Papillons (Opus 2; 1829-31), and practiced industriously...",
    price: 131,
    published: "1831",
    new_arrival: false,
    music_image: "img_10.jpg",
    music_clip: "m10.mp3"
  },
  {
    music_name: "Symphony No. 3",
    category: "Late 19th",
    composer: "Gustav Mahler",
    description: "Symphony No. 3, symphony for orchestra and choruses by Austrian composer Gustav Mahler that purports to encapsulate everything the composer had learned about life to date...",
    price: 80,
    published: "1902",
    new_arrival: false,
    music_image: "img_11.jpg",
    music_clip: "m11.mp3"
  },
  {
    music_name: "Liszt: Bagatelle sans tonalite",
    category: "Late 19th",
    composer: "Liszt",
    description: "In 1869 Liszt was invited to return to Weimar by the grand duke to give master classes in piano playing, and two years later he was asked to do the same in Budapest...",
    price: 103,
    published: "1872",
    new_arrival: false,
    music_image: "img_12.jpg",
    music_clip: "m12.mp3"
  }
]

const main = async() =>{
  // Connecting to the database
  await mongoose.connect(process.env.DB_URI, {useNewUrlParser: true}).then(() => console.log(`db connected`)).catch((err) => {throw err})
  //Dropping all the collection exist in the database
  const collections = await mongoose.connection.db.listCollections().toArray();
  collections
      .map((collection) => collection.name)
      .forEach(async (collectionName) => {
        await mongoose.connection.db.dropCollection(collectionName);
      });
  gfs = Grid(mongoose.connection.db, mongoose.mongo)
  var list = await fs.readdirSync(`./Materials`)
  Promise.all(
    list.map(async (item) => {
      var temp = await gfs.files.find({filename: item}).toArray().catch((err) => {throw err})
      if (temp.length === 0){
        return new Promise((resolve, reject) => {
          var writeStream = gfs.createWriteStream({
            filename: item
          });
          fs.createReadStream(`./Materials/${item}`).pipe(writeStream)

          writeStream.on('close', function(file){
            console.log(`${file.filename} has been added to db`)
            resolve(``)
          })
        })
      }else{
        console.log('hi')
        console.log(`${item} already exists in the db`)
        return new Promise((resolve, reject) => {
          resolve(``)
        })
      }
    })
  ).then(async () =>{
    var password = await bcrypt.hash('Tester', 10)
    await User.createCollection()
    var n = new User({
      first_name: 'Tester',
      last_name: 'Tester',
      email: 'Tester@Tester.com',
      password: password,
      invoice: []
    })
    console.log(n._id)
    n.save().then(chatRoom => console.log(chatRoom._id));
    await Music.createCollection()
    await Music.create(musicData)
  }).then(() => {
    mongoose.disconnect(() => {
      console.log(`Disconnect to Database`)
    })
  })
}

main()











































