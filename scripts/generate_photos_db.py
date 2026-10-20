import os
import json
import base64
import io
from PIL import Image, ExifTags

PHOTO_METADATA = {
    "025-2_W__.jpg": {
        "title": "Velvet Crimson Petals",
        "category": "Nature & Flora",
        "description": "Macro shot of deep velvet crimson roses glistening with crystal morning dew drops."
    },
    "CSC_0144-3___W.jpg": {
        "title": "Curves in Concrete",
        "category": "Urban & Architecture",
        "description": "Concentric geometric stone tiers of an open-air amphitheater receding into the distance."
    },
    "DSC_0031_W.jpg": {
        "title": "Morning Dewdrop",
        "category": "Nature & Flora",
        "description": "A single spherical water drop suspended delicately on the curve of a vibrant green leaf."
    },
    "DSC_0071.jpg": {
        "title": "Horizon on Fire",
        "category": "Nature & Flora",
        "description": "Dramatic crimson and violet sunset sky blazing above the distant silhouette of the city."
    },
    "DSC_0081__W_.jpg": {
        "title": "Whispering Woods",
        "category": "Monochrome",
        "description": "High-contrast black and white perspective looking down a secluded path flanked by tall timber."
    },
    "DSC_0134__W.jpg": {
        "title": "Dew along the Spine",
        "category": "Nature & Flora",
        "description": "Macro study of fresh morning moisture beads tracing the central vein of a lush palm frond."
    },
    "DSC_0210-1.jpg": {
        "title": "Barbed Border",
        "category": "Street & Life",
        "description": "Taut strands of rusted barbed wire sharply contrasted against the soft bokeh of a sunlit grove."
    },
    "DSC_0226-1.jpg": {
        "title": "Twin Tea Kettles",
        "category": "Street & Life",
        "description": "Rustic aluminum kettles simmering over charcoal coals at a roadside tea stall in evening light."
    },
    "DSC_0275__W_.jpg": {
        "title": "Waterfront Illuminations",
        "category": "Urban & Architecture",
        "description": "Festive strings of fairy lights and illuminated pavilion structures mirrored in dark tranquil waters."
    },
    "DSC_0296-2.jpg": {
        "title": "Twilight on the Water",
        "category": "Nature & Flora",
        "description": "A serene violet and rose dusk reflecting across calm river marshlands."
    },
    "DSC_0301.jpg": {
        "title": "Golden Hour Fisher",
        "category": "Street & Life",
        "description": "A solitary village boy wading through muddy floodwaters bathed in golden late afternoon sun."
    },
    "DSC_0358-3.jpg": {
        "title": "Carefree Spirits",
        "category": "Portraits",
        "description": "Candid capture of village children playfully wrestling and sharing genuine laughter on the red earth."
    },
    "DSC_0363.jpg": {
        "title": "Chai & Night Motion",
        "category": "Street & Life",
        "description": "Motion blur of passing rickshaws streaks across the warm glow of an intimate roadside tea cabin."
    },
    "DSC_0426.jpg": {
        "title": "Sailing into the Blue",
        "category": "Street & Life",
        "description": "Perspective from the bow of a wooden country boat heading into the wide open blue haze."
    },
    "DSC_0428__W_.jpg": {
        "title": "Promenade Lights",
        "category": "Urban & Architecture",
        "description": "Reflections of evening decorative lights dancing across still waters along the pedestrian pier."
    },
    "DSC_0493.jpg": {
        "title": "Brothers in the Sun",
        "category": "Portraits",
        "description": "Black and white portrait of two young village brothers sharing an infectious, candid smile."
    },
    "DSC_0500-1__W_.jpg": {
        "title": "Frets & Strings",
        "category": "Concerts & Music",
        "description": "Macro close-up detailing the headstock, tuning machines, and steel strings of an electric guitar."
    },
    "DSC_0594__W_.jpg": {
        "title": "Solitary Dinghy",
        "category": "Street & Life",
        "description": "A traditional wooden fishing boat rests on the sandbar as the tide recedes under vast skies."
    },
    "DSC_0666.jpg": {
        "title": "Midnight Cuppa",
        "category": "Street & Life",
        "description": "A warm glass mug of black tea resting quietly on a brick ledge overlooking the night city."
    },
    "DSC_0776-2__W_.jpg": {
        "title": "Floating Haven",
        "category": "Street & Life",
        "description": "Weathered wooden skiffs drifting near the grassy shoreline of a calm rural lagoon."
    },
    "DSC_1043-1__W.jpg": {
        "title": "Echoes of Mind",
        "category": "Portraits",
        "description": "An artistic double-exposure portrait exploring introspective thoughts and layered silhouettes."
    },
    "DSC_2118.jpg": {
        "title": "Puddle Reflection",
        "category": "Street & Life",
        "description": "A solitary crow stands beside a rain puddle in an urban alley reflecting colorful chairs."
    },
    "DSC_2791.jpg": {
        "title": "Moonlit Cloudscape",
        "category": "Nature & Flora",
        "description": "The moon casts a silver glow through turbulent stratocumulus clouds above the city skyline."
    },
    "DSC_2854.jpg": {
        "title": "Blue Hour Silence",
        "category": "Nature & Flora",
        "description": "Minimalist dusk horizon with the fading golden twilight line surrendering to deep night blue."
    },
    "DSC_3059.jpg": {
        "title": "Two Wanderers",
        "category": "Street & Life",
        "description": "Silhouettes of two friends gazing out at the evening skyline during a pastel sunset."
    },
    "DSC_3296-2.jpg": {
        "title": "Pathway through Green",
        "category": "Nature & Flora",
        "description": "A winding earthen trail leads across vibrant green rice fields under threatening monsoon clouds."
    },
    "DSC_3298.jpg": {
        "title": "Timber Giants",
        "category": "Nature & Flora",
        "description": "Slender eucalyptus trees swaying against a heavy overcast sky in a quiet rural grove."
    },
    "DSC_3520.jpg": {
        "title": "Strumming in the Dark",
        "category": "Concerts & Music",
        "description": "Musician lost in flow while strumming chords on a red Fernandes electric guitar."
    },
    "DSC_3729__W_.jpg": {
        "title": "Spiny Wildflower",
        "category": "Nature & Flora",
        "description": "Macro close-up capturing the delicate spikes and vivid green details of wild meadow flora."
    },
    "DSC_3731__.jpg": {
        "title": "Monolithic Curves",
        "category": "Urban & Architecture",
        "description": "A striking wide low-angle perspective looking up at sweeping modern campus architecture."
    },
    "DSC_3778-2_W.jpg": {
        "title": "Flight at Dawn",
        "category": "Nature & Flora",
        "description": "Silhouetted flock of birds taking flight into a clear minimalist sky at daybreak."
    },
    "DSC_3897__W_.jpg": {
        "title": "Words in the Light",
        "category": "Street & Life",
        "description": "A folded paper cone filled with roasted street snacks lit warmly from behind."
    },
    "DSC_3929__B__W.jpg": {
        "title": "Candlelit Reverie",
        "category": "Street & Life",
        "description": "A single candle flame flickers inside a glass holder encircled by golden orbs of bokeh."
    },
    "DSC_3965-2.jpg": {
        "title": "Speed of the Highway",
        "category": "Street & Life",
        "description": "Radial motion blur zooming down a tree-canopied regional highway past moving rickshaws."
    },
    "DSC_4280.jpg": {
        "title": "Softbox Silhouette",
        "category": "Concerts & Music",
        "description": "Studio portrait of a guitarist backlit by a massive diffuser softbox in stark black and white."
    },
    "DSC_4280__.jpg": {
        "title": "Electric Blue Aura",
        "category": "Concerts & Music",
        "description": "The softbox backlit guitarist composition rendered in a cool, moody electric blue tone."
    },
    "DSC_4618__W_.jpg": {
        "title": "Heavy Metal Smoke",
        "category": "Concerts & Music",
        "description": "Vocalist and band engulfed in golden volumetric stage smoke during an intense live concert."
    },
    "DSC_4689_A_.jpg": {
        "title": "Spotlight on Bass",
        "category": "Concerts & Music",
        "description": "An electric bass guitar rests on its stage stand bathed in a single dramatic amber beam."
    },
    "DSC_5866-1___W.jpg": {
        "title": "Urban Blur",
        "category": "Street & Life",
        "description": "Dynamic panning exposure of a green CNG auto-rickshaw and cyclist rushing through city streets."
    },
    "DSC_6104.jpg": {
        "title": "Sun-dappled Village Road",
        "category": "Nature & Flora",
        "description": "Warm afternoon light filters through grand banyan tree branches onto a quiet brick lane."
    },
    "DSC_6153_W_1_2_.jpg": {
        "title": "Morning Fog on the Sandbar",
        "category": "Street & Life",
        "description": "Wooden river boats rest quietly on the riverbank sandbar shrouded in a blanket of morning mist."
    },
    "DSC_6195.jpg": {
        "title": "Crossing the Shallows",
        "category": "Street & Life",
        "description": "Boatmen poling a passenger dinghy across the gentle shallows of a wide Bangladeshi river."
    },
    "DSC_6218.jpg": {
        "title": "Patchwork Fields",
        "category": "Nature & Flora",
        "description": "High vantage view over fertile agricultural acreage and lush green paddies under sunny skies."
    },
    "DSC_6530_W_.jpg": {
        "title": "Half-Submerged Boat",
        "category": "Nature & Flora",
        "description": "An abandoned wooden rowboat rests half-sunken in still pond waters among water lilies."
    },
    "DSC_6659-1___W.jpg": {
        "title": "Ripple Sky at Sundown",
        "category": "Nature & Flora",
        "description": "Rippling altocumulus clouds bathed in pastel crimson and gold above urban silhouettes."
    },
    "DSC_7074_W_.jpg": {
        "title": "The Running Form",
        "category": "Urban & Architecture",
        "description": "Striking architectural ceiling art depicting a dynamic human runner sculpture illuminated from above."
    },
    "DSC_7440_W_.jpg": {
        "title": "Sacred Chimes",
        "category": "Street & Life",
        "description": "Selective monochrome capture of ornamental brass temple bells hanging in quiet reverence."
    },
    "DSC_7483.jpg": {
        "title": "Relic on the Pavement",
        "category": "Street & Life",
        "description": "Macro study of a discarded cigarette filter pressed between the grooves of concrete pavement."
    },
    "DSC_7516.jpg": {
        "title": "Ready for Sound",
        "category": "Concerts & Music",
        "description": "A live stage dynamic microphone waiting in sharp focus before glowing concert spotlights."
    },
    "DSC_9060.jpg": {
        "title": "Teal Solitude",
        "category": "Street & Life",
        "description": "A cigarette propped diagonally against a weathered wall with cool teal and ambient lighting."
    },
    "DSC_9524_W_.jpg": {
        "title": "The Narrow Chasm",
        "category": "Urban & Architecture",
        "description": "A deep vertical brick passage framed by decaying multi-story tenements in the old quarter."
    },
    "DSC_9572__W_.jpg": {
        "title": "The Artisan's Hands",
        "category": "Portraits",
        "description": "An elderly craftsman working with focused devotion under the warm cone of a hanging bulb."
    },
    "IMG_7633___-002.jpg": {
        "title": "Behind the Viewfinder",
        "category": "Street & Life",
        "description": "Hands gripping a Nikon DSLR camera body dialed in and ready for the next frame."
    },
    "Mushfiqur Rahman_01.jpg": {
        "title": "Billowing Sail",
        "category": "Monochrome",
        "description": "Dramatic monochrome capture of a traditional single-sail wooden dinghy catching river wind."
    },
    "Mushfiqur Rahman_010.jpg": {
        "title": "Sky of Embers",
        "category": "Nature & Flora",
        "description": "The setting sun bursts through a dramatic ribbed cloud blanket over city rooftops."
    },
    "Mushfiqur Rahman_011.jpg": {
        "title": "Boat in Motion",
        "category": "Street & Life",
        "description": "Smooth horizontal panning motion blur following a riverboat gliding against the green shore."
    },
    "Mushfiqur Rahman_012.jpg": {
        "title": "Royal Velvet",
        "category": "Nature & Flora",
        "description": "Rich purple rose blossoms blanketed with fresh crystalline raindrops after a light shower."
    },
    "Mushfiqur Rahman_013 .jpg": {
        "title": "River Passage",
        "category": "Street & Life",
        "description": "Panning shutter capture tracking boatmen steering a country boat through river currents."
    },
    "Mushfiqur Rahman_02.jpg": {
        "title": "Mirror Reflection",
        "category": "Street & Life",
        "description": "Framed reflection of the driver in a convex side mirror as city traffic glides past outside."
    },
    "Mushfiqur Rahman_03.jpg": {
        "title": "The Bamboo Weaver",
        "category": "Portraits",
        "description": "Elderly artisan patiently splitting and weaving cane strips on the ground in serene cool tones."
    },
    "Mushfiqur Rahman_04.jpg": {
        "title": "Sparks in the Twilight",
        "category": "Street & Life",
        "description": "An industrial welder working on steel construction creating an arc of incandescent embers."
    },
    "Mushfiqur Rahman_05.jpg": {
        "title": "Evening Chai",
        "category": "Street & Life",
        "description": "A glass mug of hot tea resting on an outdoor rail beside wire fencing and blurred city bokeh."
    },
    "Mushfiqur Rahman_06.jpg": {
        "title": "Street Slumber",
        "category": "Portraits",
        "description": "Black and white emotional portrait of an exhausted street laborer asleep on hard concrete steps."
    },
    "Mushfiqur Rahman_07.jpg": {
        "title": "Midnight Bass",
        "category": "Concerts & Music",
        "description": "Electric bass guitar highlighted by a warm theatrical spotlight on an otherwise dark stage."
    },
    "Mushfiqur Rahman_08.jpg": {
        "title": "River Mist",
        "category": "Street & Life",
        "description": "Country boats resting on the sandy shore engulfed in a tranquil shroud of morning fog."
    },
    "Mushfiqur Rahman_09.jpg": {
        "title": "The Steel Cage",
        "category": "Street & Life",
        "description": "A smiling young construction laborer framed through circular structural steel rebar."
    },
    "_DSC6731.jpg": {
        "title": "Square Chrono",
        "category": "Street & Life",
        "description": "Close-up of a Fastrack square-dial wristwatch resting on a textured tabletop."
    },
    "_____0439.jpg": {
        "title": "Drifting in Silence",
        "category": "Monochrome",
        "description": "Minimalist black and white composition of a solitary sailboat drifting on calm river waters."
    },
    "ttest.jpg": {
        "title": "Tea Stall Delights",
        "category": "Street & Life",
        "description": "Glass jars filled with traditional biscuits and bakery snacks displayed on a tea cabin counter."
    }
}

def format_file_size(size_bytes):
    if size_bytes < 1024:
        return f"{size_bytes} B"
    elif size_bytes < 1024 * 1024:
        return f"{size_bytes / 1024:.1f} KB"
    else:
        return f"{size_bytes / (1024 * 1024):.1f} MB"

def generate_blur_data_url(im):
    thumb = im.copy()
    thumb.thumbnail((20, 20), Image.Resampling.LANCZOS)
    buffered = io.BytesIO()
    thumb.save(buffered, format="JPEG", quality=40)
    return "data:image/jpeg;base64," + base64.b64encode(buffered.getvalue()).decode('utf-8')

def parse_exif(raw_exif):
    if not raw_exif:
        return {}
    
    clean = {}
    make = str(raw_exif.get("Make", "")).strip()
    model = str(raw_exif.get("Model", "")).strip()
    
    if "NIKON" in model.upper():
        camera_name = model.title()
    elif make and model:
        camera_name = f"{make} {model}"
    else:
        camera_name = model or make or "Nikon D3000"
        
    clean["camera"] = camera_name.replace("Nikon Corporation", "Nikon").replace("NIKON", "Nikon")
    clean["make"] = make or "Nikon"
    clean["model"] = model.replace("NIKON ", "") if model else "D3000"
    
    focal_length = raw_exif.get("FocalLength")
    if focal_length is not None:
        try:
            fl_val = float(focal_length)
            clean["focalLength"] = f"{int(fl_val)}mm"
        except:
            clean["focalLength"] = f"{focal_length}mm"
            
    focal_35 = raw_exif.get("FocalLengthIn35mmFilm")
    if focal_35:
        clean["focalLength35mm"] = f"{focal_35}mm"
        if clean.get("focalLength"):
            clean["lens"] = f"{clean['focalLength']} (35mm eq: {focal_35}mm)"
    elif clean.get("focalLength"):
        clean["lens"] = clean["focalLength"]

    f_num = raw_exif.get("FNumber")
    if f_num is not None:
        try:
            clean["aperture"] = f"f/{float(f_num):.1f}".rstrip('0').rstrip('.')
        except:
            clean["aperture"] = f"f/{f_num}"

    exp_time = raw_exif.get("ExposureTime")
    if exp_time is not None:
        try:
            t = float(exp_time)
            if t < 1.0 and t > 0:
                clean["shutterSpeed"] = f"1/{int(round(1.0 / t))}s"
            else:
                clean["shutterSpeed"] = f"{t:.1f}s"
        except:
            clean["shutterSpeed"] = f"{exp_time}s"

    iso = raw_exif.get("ISOSpeedRatings")
    if iso is not None:
        clean["iso"] = f"ISO {iso}"
        clean["isoValue"] = int(iso)

    metering_map = {1: "Average", 2: "Center-weighted", 3: "Spot", 5: "Matrix / Multi-spot"}
    if "MeteringMode" in raw_exif:
        clean["meteringMode"] = metering_map.get(raw_exif["MeteringMode"], "Matrix")

    if "WhiteBalance" in raw_exif:
        clean["whiteBalance"] = "Manual" if raw_exif["WhiteBalance"] == 1 else "Auto"

    date_orig = raw_exif.get("DateTimeOriginal") or raw_exif.get("DateTime")
    if date_orig:
        try:
            # Format: '2011:01:20 12:15:19'
            parts = str(date_orig).split(" ")
            d_parts = parts[0].split(":")
            months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
            m_idx = int(d_parts[1])
            clean["dateTaken"] = f"{months[m_idx]} {int(d_parts[2])}, {d_parts[0]}"
            clean["dateTakenISO"] = f"{d_parts[0]}-{d_parts[1]}-{d_parts[2]}T{parts[1]}"
        except:
            pass

    if "Software" in raw_exif:
        clean["software"] = str(raw_exif["Software"]).strip()

    return clean

def build_caption_string(exif):
    parts = []
    if exif.get("camera"):
        parts.append(exif["camera"])
    if exif.get("focalLength"):
        parts.append(exif["focalLength"])
    if exif.get("aperture"):
        parts.append(exif["aperture"])
    if exif.get("shutterSpeed"):
        parts.append(exif["shutterSpeed"])
    if exif.get("iso"):
        parts.append(exif["iso"])
    return " • ".join(parts) if parts else "Nikon D3000 • Photography by Mushfiqur Rahman"

def main():
    photos_dir = "public/assets/photos"
    filenames = sorted(os.listdir(photos_dir))
    print(f"Scanning {len(filenames)} photos...")

    database = []

    for idx, fname in enumerate(filenames):
        fpath = os.path.join(photos_dir, fname)
        file_bytes = os.path.getsize(fpath)
        
        with Image.open(fpath) as im:
            w, h = im.size
            aspect_ratio = round(w / h, 3)
            orientation = "landscape" if w > h else ("portrait" if h > w else "square")
            
            # Extract raw exif
            raw_exif = {}
            if hasattr(im, "_getexif"):
                exif_data = im._getexif()
                if exif_data:
                    for tag_id, val in exif_data.items():
                        tag_name = ExifTags.TAGS.get(tag_id, str(tag_id))
                        if isinstance(val, (bytes, bytearray)):
                            continue
                        try:
                            # Test JSON serializable
                            json.dumps(val)
                            raw_exif[tag_name] = val
                        except:
                            raw_exif[tag_name] = str(val)
            
            blur_data_url = generate_blur_data_url(im)

        exif = parse_exif(raw_exif)
        meta = PHOTO_METADATA.get(fname, {
            "title": fname.rsplit(".", 1)[0].replace("_", " ").strip(),
            "category": "Street & Life",
            "description": f"Photo {fname} captured by Mushfiqur Rahman"
        })

        caption = build_caption_string(exif)

        entry = {
            "id": f"photo-{idx+1:03d}",
            "filename": fname,
            "src": f"/assets/photos/{fname}",
            "url": f"/assets/photos/{fname}",
            "fileSizeBytes": file_bytes,
            "fileSize": format_file_size(file_bytes),
            "width": w,
            "height": h,
            "aspectRatio": aspect_ratio,
            "orientation": orientation,
            "title": meta["title"],
            "caption": caption,
            "description": meta["description"],
            "category": meta["category"],
            "tags": [meta["category"], exif.get("camera", "Nikon D3000")],
            "exif": exif,
            "rawExif": raw_exif,
            "blurDataURL": blur_data_url
        }

        database.append(entry)

    print(f"Successfully processed {len(database)} photos.")

    # Write to data/photos-db.json and public/photos-db.json
    with open("data/photos-db.json", "w", encoding="utf-8") as f:
        json.dump(database, f, indent=2, ensure_ascii=False)
    print("Wrote data/photos-db.json")

    with open("public/photos-db.json", "w", encoding="utf-8") as f:
        json.dump(database, f, indent=2, ensure_ascii=False)
    print("Wrote public/photos-db.json")

if __name__ == "__main__":
    main()
