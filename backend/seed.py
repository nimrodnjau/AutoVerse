from app import app
from models import db, Car, User
from werkzeug.security import generate_password_hash

CARS = [
    {'brand':'Toyota','name':'Land Cruiser V8','year':2022,'price':8500000,'category':'suv','mileage':'12,400','fuel_type':'Diesel','engine':'4.5L V8','power':'309hp','color':'Pearl White','badge':'hot','emoji':'🚙','description':'The iconic Land Cruiser V8 — unmatched off-road capability with supreme comfort. Full-time 4WD, heated leather seats, panoramic sunroof. Nairobi-inspected, clean logbook.'},
    {'brand':'BMW','name':'5 Series M Sport','year':2023,'price':6200000,'category':'luxury','mileage':'8,200','fuel_type':'Petrol','engine':'3.0L Inline-6','power':'374hp','color':'Alpine White','badge':'new','emoji':'🚗','description':'Exhilarating performance meets executive luxury. M Sport package, adaptive suspension, Harman Kardon sound, 19" alloys.'},
    {'brand':'Subaru','name':'Forester XT','year':2020,'price':2800000,'category':'suv','mileage':'34,000','fuel_type':'Petrol','engine':'2.0L Turbo','power':'177hp','color':'Crystal Black','badge':'sale','emoji':'🚙','description':'Symmetrical AWD for Kenya\'s varied terrain. EyeSight safety suite, X-MODE off-road system, spacious boot.'},
    {'brand':'Mercedes-Benz','name':'C200 AMG Line','year':2023,'price':5400000,'category':'luxury','mileage':'5,000','fuel_type':'Petrol','engine':'1.5L Hybrid','power':'204hp','color':'Obsidian Black','badge':'new','emoji':'🚘','description':'Sophisticated elegance with cutting-edge technology. MBUX infotainment, 64-color ambient lighting, air suspension.'},
    {'brand':'Toyota','name':'Hilux Double Cab','year':2021,'price':4100000,'category':'pickup','mileage':'28,500','fuel_type':'Diesel','engine':'2.8L GD6','power':'201hp','color':'Silver Metallic','badge':None,'emoji':'🚛','description':'Africa\'s most trusted workhorse. 4x4 capability, 3.5 tonne tow rating, spacious cabin.'},
    {'brand':'Honda','name':'Civic RS Turbo','year':2021,'price':2200000,'category':'sedan','mileage':'41,200','fuel_type':'Petrol','engine':'1.5L VTEC Turbo','power':'182hp','color':'Sonic Gray Pearl','badge':'sale','emoji':'🚗','description':'Sporty styling meets everyday practicality. Honda Sensing safety tech, 10.2" touchscreen, wireless Apple CarPlay.'},
    {'brand':'Porsche','name':'Cayenne S','year':2024,'price':14800000,'category':'luxury','mileage':'3,100','fuel_type':'Petrol','engine':'2.9L Biturbo V6','power':'440hp','color':'Jet Black Metallic','badge':'new','emoji':'🏎','description':'The sports car among SUVs. PASM suspension, Bose Surround Sound, panoramic roof, 21" turbo wheels.'},
    {'brand':'Ford','name':'Ranger Wildtrak','year':2022,'price':3600000,'category':'pickup','mileage':'19,800','fuel_type':'Diesel','engine':'2.0L Bi-Turbo','power':'213hp','color':'Conquer Green','badge':None,'emoji':'🚛','description':'Built for adventure. Ford SYNC 4 infotainment, Trail Control, matrix LED headlamps, 10-speed automatic.'},
    {'brand':'Mazda','name':'CX-5 Skyactiv','year':2022,'price':3100000,'category':'suv','mileage':'22,000','fuel_type':'Petrol','engine':'2.5L SkyActiv','power':'190hp','color':'Soul Red Crystal','badge':None,'emoji':'🚙','description':'Japanese craftsmanship at its finest. KODO design, i-Activsense safety, Bose 10-speaker audio, heated seats.'},
    {'brand':'Kia','name':'Stinger GT','year':2022,'price':4500000,'category':'sport','mileage':'15,600','fuel_type':'Petrol','engine':'3.3L Twin-Turbo V6','power':'365hp','color':'Ceramic Silver','badge':'hot','emoji':'🏎','description':'Gran Turismo DNA in a practical package. 0-100 in 4.9 seconds, Brembo brakes, Harman Kardon audio.'},
    {'brand':'Volkswagen','name':'Touareg R-Line','year':2023,'price':7200000,'category':'suv','mileage':'9,500','fuel_type':'Diesel','engine':'3.0L TDI V6','power':'282hp','color':'Deep Black Pearl','badge':None,'emoji':'🚙','description':'Premium German engineering. Innovision Cockpit with 15" display, air suspension, 8-speed automatic.'},
    {'brand':'Nissan','name':'GTR Premium','year':2021,'price':11200000,'category':'sport','mileage':'6,800','fuel_type':'Petrol','engine':'3.8L Twin-Turbo V6','power':'565hp','color':'Ultimate Metal Silver','badge':'hot','emoji':'🏎','description':'Godzilla. The legendary supercar with everyday usability. ATTESA ET-S AWD, Bilstein DampTronic shocks.'},
]

with app.app_context():
    db.create_all()

    # Seed Cars
    if Car.query.count() == 0:
        for c in CARS:
            db.session.add(Car(**c))
        db.session.commit()
        print(f'Seeded {len(CARS)} cars.')
    else:
        print('Cars already seeded.')
    
    # Seed admin user
    if not User.query.filter_by(email='admin@autoverse.co.ke').first():
        admin = User(
            first_name='Admin',
            last_name='AutoVerse',
            email='admin@autoverse.co.ke',
            phone='0700000000',
            password_hash=generate_password_hash('admin123'),
            is_admin=True
        )
        db.session.add(admin)
        db.session.commit()
        print('Admin user created.')
    else:
        print('Admin already exists.')