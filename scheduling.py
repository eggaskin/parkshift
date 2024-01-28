# real time
#time = 0    # in minutes

class ParkingLot:
    def __init__(self, name, total_spots):
        self.name = name
        self.total_spots = total_spots
        self.free_spots = total_spots
        self.users = {}

    def add_user(self, user, leave_time):
        self.users[user.name] = {'score':user.get_score(),'leave_time': leave_time}
        self.free_spots -= 1
    
    def remove_user(self, user):
        if user in self.users:
            userObj = User(user, self.users[user]['score'])
            if time <= self.users[user]['leave_time']:
                userObj.park(True)
            else:
                userObj.park(False)
            del self.users[user]
            self.free_spots += 1
            return userObj
    
    def update_leave_time(self, user, new_leave_time):
        if user in self.users:
            self.users[user]['leave_time'] = new_leave_time
    
    def get_free_spots(self):
        return self.free_spots
    
    def get_total_spots(self):
        return self.total_spots
    
    def get_free_time(self):
        # returns the next time a spot will be free
        free_time = []
        for user in self.users.items():
            free_time.append(( user[1]['leave_time'],user[1]['score']))
        
        # return a weighted average of the free times, if weight is 
        #smaller then the leave time should be increased
        return min([time+time*(1-w) for time,w in free_time])

class ParkingLotManager:
    def __init__(self):
        self.parking_lots = {}
        self.parking_lots['A'] = ParkingLot('A', 5)
        self.parking_lots['B'] = ParkingLot('B', 5)
        self.parking_lots['Y'] = ParkingLot('Y', 5)
    
    def add_user(self, user, lot, leave_time):
        print("Adding user to Lot", lot, "for", leave_time, "minutes...")
        self.parking_lots[lot].add_user(user, leave_time)
    
    def remove_user(self, user, lot):
        userObj = self.parking_lots[lot].remove_user(user)
        return userObj
    
    def update_leave_time(self, user, lot, new_leave_time):
        self.parking_lots[lot].update_leave_time(user, new_leave_time)
    
    def get_free_spots(self, lot):
        return self.parking_lots[lot].get_free_spots()
    
    def get_total_spots(self, lot):
        return self.parking_lots[lot].get_total_spots()
    
    def get_free_time(self, lot):
        return self.parking_lots[lot].get_free_time()

class User:
    def __init__(self,name):
        self.name=name
        self.score=1 # num times successfully parked and left in time
        self.parks = 1 # num times parked in total

    def get_name(self):
        return self.name
    
    def get_score(self):
        return self.score
    
    def park(self,intime):
        if intime: self.score += 1
        self.parks += 1

    def score(self):
        return self.score/self.parks

def main():
    # demo
    user = User('user')
    parking = ParkingLotManager()
    parking.add_user(user, 'A', 20)
    parking.add_user(User('user2'), 'A', 10)
    input()

    print("Lot A has free: ", parking.get_free_spots('A'))
    print("Lot Y has free: ", parking.get_free_spots('Y'))
    input()

    for i in range(5):
        parking.add_user(User('user'+str(i)), 'Y', 20)

    input()
    print("Adding user to Lot A for 30 minutes...")
    parking.add_user(User('user3'), 'A', 30)
    print("Free spots in Lot A:", parking.get_free_spots('A'))

    input()
    print("Removing user from Lot A...")
    parking.remove_user(user, 'A')
    print("Free spots in Lot A:", parking.get_free_spots('A'))

    input()
    print("Updating leave time for user2 in Lot A to 15 minutes...")
    parking.update_leave_time(User('user2'), 'A', 15)
    print("Free spots in Lot A:", parking.get_free_time('A'))

    print("Free time in Lot Y:", parking.get_free_time('Y'))


if __name__ == '__main__':
    main()
