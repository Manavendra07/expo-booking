import React, { useState } from 'react';
import { MapPin, Users, Calendar, Clock } from 'lucide-react';

const ModernBookingForm = () => {
    const [formData, setFormData] = useState({
        venueName: '',
        eventType: '',
        guestCount: '',
        eventDate: '',
        eventTime: '',
        budget: '',
        specialRequirements: '',
        contactEmail: '',
    });

    const [selectedVenue, setSelectedVenue] = useState(null);

    const venues = [
        { id: 1, name: 'Grand Ballroom', capacity: 500, pricePerHour: 450, features: ['WiFi', 'Catering', 'Parking', 'Soundsystem'] },
        { id: 2, name: 'Botanical Garden', capacity: 300, pricePerHour: 350, features: ['Outdoor', 'Photography', 'Bar Service'] },
        { id: 3, name: 'Modern Convention', capacity: 1000, pricePerHour: 600, features: ['Stage', 'Projection', 'Full AV'] },
        { id: 4, name: 'Intimate Lounge', capacity: 100, pricePerHour: 200, features: ['Cozy', 'Premium Bar', 'DJ Ready'] },
    ];

    const eventTypes = ['Wedding', 'Corporate', 'Conference', 'Private Party', 'Birthday', 'Gala', 'Networking Event'];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Booking submitted:', formData);
        alert('Booking request submitted! One of our specialists will contact you shortly.');
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Venue Selection */}
                    <div className="glass-panel p-8">
                        <h3 className="heading-md mb-6">Select Venue</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {venues.map((venue) => (
                                <div
                                    key={venue.id}
                                    onClick={() => {
                                        setSelectedVenue(venue);
                                        setFormData(prev => ({ ...prev, venueName: venue.name }));
                                    }}
                                    className={`
                    glass-panel p-5 cursor-pointer group
                    border-2 transition-all duration-300
                    ${selectedVenue?.id === venue.id
                                            ? 'border-gold bg-gold/10 shadow-lg shadow-gold/20'
                                            : 'border-emerald-500/30 hover:border-gold/50'
                                        }
                  `}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <h4 className="font-semibold text-white">{venue.name}</h4>
                                        <span className="text-xs font-bold text-gold">${venue.pricePerHour}/hr</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted mb-3">
                                        <Users size={16} />
                                        <span>Up to {venue.capacity} guests</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {venue.features.map((feature) => (
                                            <span key={feature} className="badge-gold text-xs">
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Event Details */}
                    <div className="glass-panel p-8">
                        <h3 className="heading-md mb-6">Event Details</h3>
                        <div className="space-y-6">
                            {/* Event Type */}
                            <div className="input-wrapper">
                                <select
                                    name="eventType"
                                    value={formData.eventType}
                                    onChange={handleInputChange}
                                    className="appearance-none cursor-pointer pr-10"
                                >
                                    <option value="">Select an event type</option>
                                    {eventTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                                <label>Event Type</label>
                            </div>

                            {/* Guest Count & Budget */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="input-wrapper">
                                    <input
                                        type="number"
                                        name="guestCount"
                                        value={formData.guestCount}
                                        onChange={handleInputChange}
                                        placeholder=" "
                                        min="1"
                                    />
                                    <label>Number of Guests</label>
                                </div>
                                <div className="input-wrapper">
                                    <input
                                        type="number"
                                        name="budget"
                                        value={formData.budget}
                                        onChange={handleInputChange}
                                        placeholder=" "
                                        min="100"
                                        step="100"
                                    />
                                    <label>Budget ($)</label>
                                </div>
                            </div>

                            {/* Date & Time */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="input-wrapper">
                                    <input
                                        type="date"
                                        name="eventDate"
                                        value={formData.eventDate}
                                        onChange={handleInputChange}
                                        placeholder=" "
                                    />
                                    <label>Event Date</label>
                                </div>
                                <div className="input-wrapper">
                                    <input
                                        type="time"
                                        name="eventTime"
                                        value={formData.eventTime}
                                        onChange={handleInputChange}
                                        placeholder=" "
                                    />
                                    <label>Start Time</label>
                                </div>
                            </div>

                            {/* Special Requirements */}
                            <div className="input-wrapper">
                                <textarea
                                    name="specialRequirements"
                                    value={formData.specialRequirements}
                                    onChange={handleInputChange}
                                    placeholder=" "
                                    rows="4"
                                ></textarea>
                                <label>Special Requirements</label>
                            </div>

                            {/* Email */}
                            <div className="input-wrapper">
                                <input
                                    type="email"
                                    name="contactEmail"
                                    value={formData.contactEmail}
                                    onChange={handleInputChange}
                                    placeholder=" "
                                    required
                                />
                                <label>Contact Email</label>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="flex-1 btn-premium btn-emerald text-white font-semibold"
                        >
                            Request Booking
                        </button>
                        <button
                            type="button"
                            className="flex-1 btn-premium btn-outline"
                        >
                            Save as Draft
                        </button>
                    </div>
                </form>
            </div>

            {/* Sidebar: Price Estimation & Features */}
            <div className="space-y-6">
                {/* Price Estimation */}
                <div className="glass-panel p-6 sticky top-32">
                    <h3 className="heading-md mb-6 text-gold">Price Estimation</h3>

                    {selectedVenue ? (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-4 border-b border-emerald-500/20">
                                <span className="text-muted">{selectedVenue.name}</span>
                                <span className="font-semibold">${selectedVenue.pricePerHour}</span>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted">Base Price (8 hrs)</span>
                                    <span>${selectedVenue.pricePerHour * 8}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted">Catering (optional)</span>
                                    <span>+$0</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted">Technology Package</span>
                                    <span>+$200</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted">Service Fee</span>
                                    <span>+$150</span>
                                </div>

                                <div className="pt-4 mt-4 border-t border-gold/30 flex justify-between items-center">
                                    <span className="font-semibold text-white">Estimated Total</span>
                                    <span className="heading-md text-gold">
                                        ${selectedVenue.pricePerHour * 8 + 350}
                                    </span>
                                </div>
                            </div>

                            <button className="w-full mt-6 btn-premium btn-gold text-sm">
                                View Full Pricing
                            </button>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-muted mb-4">Select a venue to see pricing details</p>
                            <div className="w-12 h-12 rounded-lg bg-emerald-500/20 mx-auto animate-pulse"></div>
                        </div>
                    )}
                </div>

                {/* Premium Features */}
                <div className="glass-panel p-6">
                    <h3 className="heading-md mb-4 text-emerald-400">Premium Features</h3>
                    <div className="space-y-3">
                        {['Complimentary Consultation', 'Event Coordinator', '24/7 Support', 'Backup Plan Coverage'].map((feature) => (
                            <div key={feature} className="flex items-center gap-3 text-sm">
                                <div className="w-2 h-2 rounded-full bg-gold"></div>
                                <span className="text-white">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Guarantees */}
                <div className="glass-panel p-6 border-emerald-400/30">
                    <h3 className="heading-md mb-4 text-emerald-400">Our Guarantee</h3>
                    <p className="text-sm text-muted leading-relaxed">
                        100% satisfaction guarantee. If you're not happy, we'll work to make it right or offer a full refund.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ModernBookingForm;
