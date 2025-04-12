import mongoose from "mongoose";
const Schema = mongoose.Schema;

const siteSchema = new Schema({
  siteName: {
    type: String,
    required: [true, 'Site name is required'],
    unique: true,
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  country: {
    type: String,
    trim: true,
    required: [true, 'Country is required']
  },
  coordinates: {
    latitude: {
      type: Number,
      default: null
    },
    longitude: {
      type: Number,
      default: null
    },
    altitude: {
      type: Number,
      default: null
    }
  },
  siteDescription: {
    type: String,
    trim: true
  },
  beneficiaries: {
    type: Number,
    default: 0
  },
  waterCapacity: {
    type: Number,
    default: 0
  },
  established: {
    type: Date,
    default: Date.now
  },
  contactPerson: {
    type: String,
    trim: true
  },
  contactPhone: {
    type: String,
    trim: true
  },
  siteImage: {
    type: String,
    default: ''
  },
  siteStatus: {
    type: String,
    enum: ['active', 'inactive', 'maintenance', 'completed'],
    default: 'inactive'
  },
  createdBy: {
    type: mongoose.Schema.Types.Mixed, // Accept both ObjectId and String
    required: true,
    ref: 'User' // Will only work for actual ObjectIds
  },
  supervisorId: {
    type: Schema.Types.Mixed,
    ref: 'User',
    default: "ADMIN JIGGY"
  },
  active: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const siteModel = mongoose.model('Site', siteSchema);

export default siteModel;