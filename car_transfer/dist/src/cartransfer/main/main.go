package main

import (
	"cartransfer"
	"cartransfer/chaincode"
	"fmt"
	"github.com/hyperledger/fabric/core/chaincode/shim"
)

func main() {
	// interface checking
	var _ cartransfer.CarTransfer = (*chaincode.CarTransferCC)(nil)

	err := shim.Start(new(chaincode.CarTransferCC))
	if err != nil {
		fmt.Printf("Error in chaincode process: %s", err)
	}
}
