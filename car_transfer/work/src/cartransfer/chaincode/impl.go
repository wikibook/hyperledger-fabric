package chaincode

import (
	"cartransfer"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
	"github.com/jinzhu/inflection"
	"strings"
)

//
// Utilities
//

// Checks length of the argument
func checkLen(logger *shim.ChaincodeLogger, expected int, args []string) error {
	if len(args) < expected {
		mes := fmt.Sprintf(
			"not enough number of arguments: %d given, %d expected",
			len(args),
			expected,
		)
		logger.Warning(mes)
		return errors.New(mes)
	}
	return nil
}

//
// Chaincode interface implementation
//
type CarTransferCC struct {
}

func (this *CarTransferCC) Init(stub shim.ChaincodeStubInterface) pb.Response {
	logger := shim.NewLogger("cartransfer")
	logger.Info("chaincode initialized")
	return shim.Success([]byte{})
}

func (this *CarTransferCC) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	logger := shim.NewLogger("cartransfer")

	//sample of API use: show tX timestamp
	timestamp, err := stub.GetTxTimestamp()
	if err != nil {
		return shim.Error(fmt.Sprintf("failed to get TX timestamp: %s", err))
	}
	logger.Infof(
		"Invoke called: Tx ID = %s, timestamp = %s",
		stub.GetTxID(),
		timestamp,
	)

	var (
		fcn  string
		args []string
	)
	fcn, args = stub.GetFunctionAndParameters()
	logger.Infof("function name = %s", fcn)
	logger.Infof("args  = %s", args)

	switch fcn {
	// adds a new Owner
	case "AddOwner":
		// checks arguments length
		if err := checkLen(logger, 1, args); err != nil {
			return shim.Error(err.Error())
		}

		// unmarshal
		owner := new(cartransfer.Owner)
		err := json.Unmarshal([]byte(args[0]), owner)
		if err != nil {
			mes := fmt.Sprintf("failed to unmarshal Owner JSON: %s", err.Error())
			logger.Warning(mes)
			return shim.Error(mes)
		}

		err = this.AddOwner(stub, owner)
		if err != nil {
			return shim.Error(err.Error())
		}

		// returns a success value
		return shim.Success([]byte{})

		// lists Owners
	case "ListOwners":
		owners, err := this.ListOwners(stub)
		if err != nil {
			return shim.Error(err.Error())
		}

		// marshal
		b, err := json.Marshal(owners)
		if err != nil {
			mes := fmt.Sprintf("failed to marshal Owners: %s", err.Error())

			logger.Warning(mes)
			return shim.Error(mes)
		}

		// returns a success value
		return shim.Success(b)

		// adds a new Car
	case "AddCar":
		// checks arguments length
		if err := checkLen(logger, 1, args); err != nil {
			return shim.Error(err.Error())
		}

		// unmarshal
		car := new(cartransfer.Car)
		err := json.Unmarshal([]byte(args[0]), car)
		if err != nil {
			mes := fmt.Sprintf("failed to unmarshal Car JSON: %s", err.Error())
			logger.Warning(mes)
			return shim.Error(mes)
		}

		err = this.AddCar(stub, car)
		if err != nil {
			return shim.Error(err.Error())
		}

		// returns a success value
		return shim.Success([]byte{})

		// lists Cars
	case "ListCars":
		cars, err := this.ListCars(stub)
		if err != nil {
			return shim.Error(err.Error())
		}

		// marshal
		b, err := json.Marshal(cars)
		if err != nil {
			mes := fmt.Sprintf("failed to marshal Cars: %s", err.Error())
			logger.Warning(mes)
			return shim.Error(mes)
		}

		// returns a success value
		return shim.Success(b)

	case "ListOwnerIdCars":

		// unmarshal
		var owner string
		err := json.Unmarshal([]byte(args[0]), &owner)
		if err != nil {
			mes := fmt.Sprintf("failed to unmarshal the 1st argument: %s", err.Error())
			logger.Warning(mes)
			return shim.Error(mes)
		}

		cars, err := this.ListOwnerIdCars(stub, owner)
		if err != nil {
			return shim.Error(err.Error())
		}

		// marshal
		b, err := json.Marshal(cars)
		if err != nil {
			mes := fmt.Sprintf("failed to marshal Cars: %s", err.Error())
			logger.Warning(mes)
			return shim.Error(mes)
		}

		// returns a success value
		return shim.Success(b)

		// gets an existing Car
	case "GetCar":
		// checks arguments length
		if err := checkLen(logger, 1, args); err != nil {
			return shim.Error(err.Error())
		}

		// unmarshal
		var id string
		err := json.Unmarshal([]byte(args[0]), &id)
		if err != nil {
			mes := fmt.Sprintf("failed to unmarshal the 1st argument: %s", err.Error())
			logger.Warning(mes)
			return shim.Error(mes)
		}

		car, err := this.GetCar(stub, id)
		if err != nil {
			return shim.Error(err.Error())
		}

		// marshal
		b, err := json.Marshal(car)
		if err != nil {
			mes := fmt.Sprintf("failed to marshal Car: %s", err.Error())
			logger.Warning(mes)
			return shim.Error(mes)
		}

		// returns a success value
		return shim.Success(b)

		// updates an existing Car
	case "UpdateCar":
		// checks arguments length
		if err := checkLen(logger, 1, args); err != nil {
			return shim.Error(err.Error())
		}

		// unmarshal
		car := new(cartransfer.Car)
		err := json.Unmarshal([]byte(args[0]), car)
		if err != nil {
			mes := fmt.Sprintf("failed to unmarshal Car JSON: %s", err.Error())
			logger.Warning(mes)
			return shim.Error(mes)
		}

		err = this.UpdateCar(stub, car)
		if err != nil {
			return shim.Error(err.Error())
		}

		// returns a success value
		return shim.Success([]byte{})

		// transfers an existing Car to an existing Owner
	case "TransferCar":
		// checks arguments length
		if err := checkLen(logger, 2, args); err != nil {
			return shim.Error(err.Error())
		}

		// unmarshal
		var carId, newOwnerId string
		err := json.Unmarshal([]byte(args[0]), &carId)
		if err != nil {
			mes := fmt.Sprintf(
				"failed to unmarshal the 1st argument: %s",
				err.Error(),
			)
			logger.Warning(mes)
			return shim.Error(mes)
		}

		err = json.Unmarshal([]byte(args[1]), &newOwnerId)
		if err != nil {
			mes := fmt.Sprintf(
				"failed to unmarshal the 2nd argument: %s",
				err.Error(),
			)
			logger.Warning(mes)
			return shim.Error(mes)
		}

		err = this.TransferCar(stub, carId, newOwnerId)
		if err != nil {
			return shim.Error(err.Error())
		}

		// returns a success valuee
		return shim.Success([]byte{})
	}

	// if the function name is unknown
	mes := fmt.Sprintf("Unknown method: %s", fcn)
	logger.Warning(mes)
	return shim.Error(mes)
}

//
// methos implementing CarTransfer interface
//

// Adds a new Owner
func (this *CarTransferCC) AddOwner(stub shim.ChaincodeStubInterface,
	owner *cartransfer.Owner) error {
	logger := shim.NewLogger("cartransfer")
	logger.Infof("AddOwner: Id = %s", owner.Id)

	// checks if the specified Owner exists
	found, err := this.CheckOwner(stub, owner.Id)
	if err != nil {
		return err
	}
	if found {
		mes := fmt.Sprintf("an Owner with Id = %s alerady exists", owner.Id)
		logger.Warning(mes)
		return errors.New(mes)
	}

	// converts to JSON
	b, err := json.Marshal(owner)
	if err != nil {
		logger.Warning(err.Error())
		return err
	}

	// creates a composite key
	key, err := stub.CreateCompositeKey("Owner", []string{owner.Id})
	if err != nil {
		logger.Warning(err.Error())
		return err
	}

	// stores to the State DB
	err = stub.PutState(key, b)
	if err != nil {
		logger.Warning(err.Error())
		return err
	}

	// returns successfully
	return nil
}

// Checks existence of the specified Owner
func (this *CarTransferCC) CheckOwner(stub shim.ChaincodeStubInterface,
	id string) (bool, error) {
	logger := shim.NewLogger("cartransfer")
	logger.Infof("CheckOwner: Id = %s", id)

	// creates a composite key
	key, err := stub.CreateCompositeKey("Owner", []string{id})
	if err != nil {
		logger.Warning(err.Error())
		return false, err
	}

	// loads from the State DB
	jsonBytes, err := stub.GetState(key)
	if err != nil {
		logger.Warning(err.Error())
		return false, err
	}

	// returns successfully
	return jsonBytes != nil, nil
}

// Lists Owners
func (this *CarTransferCC) ListOwners(stub shim.ChaincodeStubInterface) ([]*cartransfer.Owner,
	error) {
	logger := shim.NewLogger("cartransfer")
	logger.Info("ListOwners")

	// executes a range query, which returns an iterator
	iter, err := stub.GetStateByPartialCompositeKey("Owner", []string{})
	if err != nil {
		logger.Warning(err.Error())
		return nil, err
	}

	// will close the iterator when returned from this method
	defer iter.Close()
	owners := []*cartransfer.Owner{}

	// loops over the iterator
	for iter.HasNext() {
		kv, err := iter.Next()
		if err != nil {
			logger.Warning(err.Error())
			return nil, err
		}
		owner := new(cartransfer.Owner)
		err = json.Unmarshal(kv.Value, owner)
		if err != nil {
			logger.Warning(err.Error())
			return nil, err
		}
		owners = append(owners, owner)
	}

	// returns successfully
	if len(owners) > 1 {
		logger.Infof("%d %s found", len(owners), inflection.Plural("Owner"))
	} else {
		logger.Infof("%d %s found", len(owners), "Owner")
	}
	return owners, nil
}

// Adds a new Car
func (this *CarTransferCC) AddCar(stub shim.ChaincodeStubInterface,
	car *cartransfer.Car) error {
	logger := shim.NewLogger("cartransfer")
	logger.Infof("AddCar: Id = %s", car.Id)

	// creates a composite key
	key, err := stub.CreateCompositeKey("Car", []string{car.Id})
	if err != nil {
		logger.Warning(err.Error())
		return err
	}

	// checks if the specified Car exists
	found, err := this.CheckCar(stub, car.Id)
	if err != nil {
		logger.Warning(err.Error())
		return err
	}
	if found {
		mes := fmt.Sprintf("Car with Id = %s already exists", car.Id)
		logger.Warning(mes)
		return errors.New(mes)
	}

	// validates the Car
	ok, err := this.ValidateCar(stub, car)
	if err != nil {
		logger.Warning(err.Error())
		return err
	}
	if !ok {
		mes := "Validation of the Car failed"
		logger.Warning(mes)
		return errors.New(mes)
	}

	// converts to JSON
	b, err := json.Marshal(car)
	if err != nil {
		logger.Warning(err.Error())
		return err
	}

	// stores to the State DB
	err = stub.PutState(key, b)
	if err != nil {
		logger.Warning(err.Error())
		return err
	}

	// returns successfully
	return nil
}

// Checks existence of the specified Car
func (this *CarTransferCC) CheckCar(stub shim.ChaincodeStubInterface, id string) (bool,
	error) {
	logger := shim.NewLogger("cartransfer")
	logger.Infof("CheckCar: Id = %s", id)

	// creates a composite key
	key, err := stub.CreateCompositeKey("Car", []string{id})
	if err != nil {
		logger.Warning(err.Error())
		return false, err
	}

	// loads from the State DB
	jsonBytes, err := stub.GetState(key)
	if err != nil {
		logger.Warning(err.Error())
		return false, err
	}

	// returns successfully
	return jsonBytes != nil, nil
}

// Validates the content of the specified Car
func (this *CarTransferCC) ValidateCar(stub shim.ChaincodeStubInterface,
	car *cartransfer.Car) (bool, error) {
	logger := shim.NewLogger("cartransfer")
	logger.Infof("ValidateCar: Id = %s", car.Id)

	// checks existence of the Owner with the OwnerId
	found, err := this.CheckOwner(stub, car.OwnerId)
	if err != nil {
		logger.Warning(err.Error())
		return false, err
	}

	// returns successfully
	return found, nil
}

// Gets the specified Car
func (this *CarTransferCC) GetCar(stub shim.ChaincodeStubInterface,
	id string) (*cartransfer.Car, error) {
	logger := shim.NewLogger("cartransfer")
	logger.Infof("GetCar: Id = %s", id)

	// creates a composite key
	key, err := stub.CreateCompositeKey("Car", []string{id})
	if err != nil {
		logger.Warning(err.Error())
		return nil, err
	}

	// loads from the state DB
	jsonBytes, err := stub.GetState(key)
	if err != nil {
		logger.Warning(err.Error())
		return nil, err
	}
	if jsonBytes == nil {
		mes := fmt.Sprintf("Car with Id = %s was not found", id)
		logger.Warning(mes)
		return nil, errors.New(mes)
	}

	// unmarshal
	car := new(cartransfer.Car)
	err = json.Unmarshal(jsonBytes, car)
	if err != nil {
		logger.Warning(err.Error())
		return nil, err
	}

	// returns successfully
	return car, nil
}

// Updates the content of the specified Car
func (this *CarTransferCC) UpdateCar(stub shim.ChaincodeStubInterface,
	car *cartransfer.Car) error {
	logger := shim.NewLogger("cartransfer")
	logger.Infof("UpdateCar: car = %+v", car)

	// checks existence of the specified Car
	found, err := this.CheckCar(stub, car.Id)
	if err != nil {
		logger.Warning(err.Error())
		return err
	}
	if !found {
		mes := fmt.Sprintf("Car with Id = %s does not exist", car.Id)
		logger.Warning(mes)
		return errors.New(mes)
	}

	// validates the Car
	ok, err := this.ValidateCar(stub, car)
	if err != nil {
		logger.Warning(err.Error())
		return err
	}
	if !ok {
		mes := "Validation of the Car failed"
		logger.Warning(mes)
		return errors.New(mes)
	}

	// creates a composite key
	key, err := stub.CreateCompositeKey("Car", []string{car.Id})
	if err != nil {
		logger.Warning(err.Error())
		return err
	}

	// converts to JSON
	b, err := json.Marshal(car)
	if err != nil {
		logger.Warning(err.Error())
		return err
	}

	// stores to the State DB
	err = stub.PutState(key, b)
	if err != nil {
		logger.Warning(err.Error())
		return err
	}

	// returns successfully
	return nil
}

// Lists Cars
func (this *CarTransferCC) ListCars(stub shim.ChaincodeStubInterface) ([]*cartransfer.Car,
	error) {
	logger := shim.NewLogger("cartransfer")
	logger.Info("ListCars")

	// executes a range query, which returns an iterator
	iter, err := stub.GetStateByPartialCompositeKey("Car", []string{})
	if err != nil {
		logger.Warning(err.Error())
		return nil, err
	}

	// will close the iterator when returned from this method
	defer iter.Close()

	// loops over the iterator
	cars := []*cartransfer.Car{}
	for iter.HasNext() {
		kv, err := iter.Next()
		if err != nil {
			logger.Warning(err.Error())
			return nil, err
		}
		car := new(cartransfer.Car)
		err = json.Unmarshal(kv.Value, car)
		if err != nil {
			logger.Warning(err.Error())
			return nil, err
		}
		cars = append(cars, car)
	}

	// returns successfully
	if len(cars) > 1 {
		logger.Infof("%d %s found", len(cars), inflection.Plural("Car"))
	} else {
		logger.Infof("%d %s found", len(cars), "Car")
	}
	return cars, nil
}

// Lists OwnerId Cars
func (this *CarTransferCC) ListOwnerIdCars(stub shim.ChaincodeStubInterface, ownerId string) ([]*cartransfer.Car,
	error) {
	logger := shim.NewLogger("cartransfer")
	logger.Info("ListOwnerCars")

	// executes a range query, which returns an iterator
	iter, err := stub.GetStateByPartialCompositeKey("Car", []string{})
	if err != nil {
		logger.Warning(err.Error())
		return nil, err
	}

	// will close the iterator when returned from this method
	defer iter.Close()

	// loops over the iterator
	cars := []*cartransfer.Car{}
	for iter.HasNext() {
		kv, err := iter.Next()
		if err != nil {
			logger.Warning(err.Error())
			return nil, err
		}
		car := new(cartransfer.Car)
		err = json.Unmarshal(kv.Value, car)
		if err != nil {
			logger.Warning(err.Error())
			return nil, err
		}
		if strings.Index(ownerId, "admin") != -1 {
			cars = append(cars, car)
		} else {
			if car.OwnerId == ownerId {
				cars = append(cars, car)
			}

		}

	}

	// returns successfully
	if len(cars) > 1 {
		logger.Infof("%d %s found", len(cars), inflection.Plural("Car"))
	} else {
		logger.Infof("%d %s found", len(cars), "Car")
	}
	return cars, nil
}

// Transfers the specified Car to the specified Owner
func (this *CarTransferCC) TransferCar(stub shim.ChaincodeStubInterface, carId string,
	newOwnerId string) error {
	logger := shim.NewLogger("cartransfer")
	logger.Infof("TransferCar: Car Id = %s, new Owner Id = %s", carId, newOwnerId)

	// gets the specified Car (err returned if it does not exist)
	car, err := this.GetCar(stub, carId)
	if err != nil {
		logger.Warning(err.Error())
		return err
	}

	// updates OwnerId field
	car.OwnerId = newOwnerId

	// stores the updated Car back to the State DB
	err = this.UpdateCar(stub, car)
	if err != nil {
		logger.Warning(err.Error())
		return err
	}

	// returns successfully
	return nil
}
