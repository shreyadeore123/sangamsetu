def calculate_confidence(missing, found):
    score = 0
    total = 0

    # Age match
    if missing.age and found.age:
        total += 1
        if abs(missing.age - found.age) <= 2:
            score += 1

    # Gender match
    if missing.gender and found.gender:
        total += 1
        if missing.gender == found.gender:
            score += 1

    # Location match
    if missing.last_seen_location and found.found_location:
        total += 1
        if missing.last_seen_location.lower() in found.found_location.lower():
            score += 1

    if total == 0:
        return 0

    return round(score / total, 2)
