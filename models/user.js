const mongoose, { Schema } = require('mongoose');
const validator = require('validator');
const uuidV4 = require('uuid/V4');
const bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost/UsersDB')

const genders = new Map([
  ['M', 'Masculino'],
  ['F', 'Femenino'],
  ['O', 'Otro'],
]);

/**
 * Caculates the sha256 of the given pan
 * @param {string} password The user's password
 */
const calculatePasswordHash = password => bcrypt.hash(password, 10);

const UserSchema = new Schema(
  {
    chileSomosUnoId: {
      type: String,
      default: uuidV4,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: [true, 'firstName is required'],
    },
    lastName: {
      type: String,
      required: [true, 'lastName is required'],
    },
    documentNumber: {
      type: String,
      required: [true, 'documentNumber is required'],
      unique: true,
    },
    documentType: {
      type: String,
      required: [true, 'documentType is required'],
      default: 'RUT',
    },
    email: {
      type: String,
      lowercase: true,
      required: [true, 'email is required'],
      validate: {
        validator: (value) => validator.isEmail(value),
        message: '{VALUE} is not a valid email',
      },
    },
    mobilePhone: {
      type: String,
      required: [true, 'mobilePhone is required'],
      validate: {
        validator: (value) => validator.isMobilePhone(value),
        message: '{VALUE} is not a valid mobilePhone',
      },
    },
    gender: {
      type: String,
      required: [true, 'gender is required'],
      enum: genders.keys(),
    },
    birthDate: {
      type: Date,
      required: [true, 'birthDate is required'],
    },
    nationality: { type: String },
    address: {
      city: { type: String },
      borough: { type: String },
      streetName: { type: String },
      streetNumber: { type: String },
    },
    password: {
      type: String,
      required: [true, 'password is required'],
      validate:{
        validator: password => this.passwordConfirmation === password,
        message: 'Password does not match',
      }
    },
  },
  {
    timestamps: true,
    discriminatorKey: 'userType'
  },
);

UserSchema.virtual('passwordConfirmation')
  .get(() => this.passwordConfirmation)
  .set(password => this.passwordConfirmation = password);

UserSchema.virtual('passwordConfirmation')
  .get(() => `${this.firstName} ${this.lastName}`);

const User = mongoose.model('User', UserSchema);

const contributionRanges = new Map([
  ['L', {lower: 10000, upper: 30000 }],
  ['M', {lower: 30001, upper: 60000 }],
  ['H', {lower: 60001 }],
]);

// Benefactor
const BenefactorSchema = new UserSchema();
BenefactorSchema.add(
  {
    contributionRange: {
      type: String,
      required: [true, 'contributionRange is required'],
      enum: contributionRanges.keys(),
    },
  },
);
const Benefactor = User.discriminator('Benefactor', BenefactorSchema);

const maritalStatuses = new Map([
  ['single', 'Soltero/a'],
  ['married', 'Casado/a'],
  ['divorced', 'Divorciado/a'],
  ['widow', 'Viudo/a'],
]);

const occupationalStatuses = new Map([
  ['employed', 'Empleado/a'],
  ['unemployedLooking', 'Sin empleo en búsqueda de empleo'],
  ['unemployedNotLooking', 'Sin empleo y sin búsqueda de empleo'],
]);

const educationalDegrees = new Map([
  ['basic', 'Enseñanza básica'],
  ['medium', 'Enseñanza media'],
  ['technicalMedium', 'Técnico en educación media'],
  ['technicalHigh', 'Educación técnica nivel superior'],
  ['universitary', 'Título profesional'],
  ['other', 'Otro'],
]);

const householdPersonsRanges = new Map([
  ['L', 'Entre 1 y 3 personas'],
  ['M', 'Entre 4 y 6 personas'],
  ['H', '7 o más personas'],
]);

const householdIncomeRanges = new Map([
  ['L', 'Entre $0 y $50.000'],
  ['M', 'Entre $50.000 y $150.000'],
  ['H', 'Entre $150.000 y $300.000'],
  ['XH', 'Más de $300.000'],
]);

// Beneficiary
const BeneficiarySchema = new UserSchema();
BeneficiarySchema.add(
  {
    maritalStatus: {
      type: String,
      required: [true, 'contributionRange is required'],
      enum: maritalStatuses.keys(),
    },
    occupationalStatus: {
      type: String,
      required: [true, 'occupationalStatus is required'],
      enum: occupationalStatuses.keys(),
    },
    educationalDegree: {
      type: String,
      required: [true, 'educationalDegree is required'],
      enum: educationalDegrees.keys(),
    },
    householdPersons: {
      type: String,
      required: [true, 'householdPersons is required'],
      enum: householdPersonsRanges.keys(),
    },
    householdMinors: {
      type: Number,
      required: [true, 'householdMinors is required'],
    },
    householdIncome: {
      type: String,
      required: [true, 'householdIncome is required'],
      enum: householdIncomeRanges.keys(),
    },
    hasStateSupport: {
      type: Boolean,
      required: [true, 'hasStateSupport is required'],
    },
    householdSheetLink: {
      type: String,
      required: [true, 'householdSheetLink is required'],
    },
  },
);
var Beneficiary = User.discriminator('Beneficiary', BeneficiarySchema);

// Admin
const AdminSchema = new UserSchema();
var Admin = User.discriminator('Admin', AdminSchema);

module.exports = {
	Benefactor,
	Beneficiary,
	Admin,
};
