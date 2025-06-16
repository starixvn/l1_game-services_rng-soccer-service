import RoundQuery from "../../../src/query-apis/round-query";

describe("RoundQuery", () => {
    let roundQuery: RoundQuery;
    let mockRoundsRepository: any;

    beforeEach(() => {
        mockRoundsRepository = {
            find: jest.fn(),
        };
        roundQuery = new RoundQuery(mockRoundsRepository, {} as any);
    });

    describe("getList", () => {
        it("should return mapped rounds with existing result and settlementResult", async () => {
            // Arrange
            const mockRounds = [
                {
                    id: 1,
                    result: { home: { rank: 1, suit: 1 }, away: { rank: 2, suit: 2 } },
                    settlementResult: { home: false, away: true, draw: false },
                    match: { home: "Team A", away: "Team B" },
                },
            ];

            mockRoundsRepository.find.mockReturnValue({
                lean: () => ({
                    exec: () => Promise.resolve(mockRounds),
                }),
            });

            // Act
            const result = await roundQuery.getList(10);

            // Assert
            expect(result).toEqual([
                {
                    roundId: mockRounds[0].id,
                    result: mockRounds[0].result,
                    settlementResult: mockRounds[0].settlementResult,
                    match: mockRounds[0].match,
                },
            ]);
            expect(mockRoundsRepository.find).toHaveBeenCalledWith({}, undefined, { sort: { _id: -1 }, limit: 10 });
        });

        it("should convert missing result and settlementResult", async () => {
            // Arrange
            const mockRounds = [
                {
                    id: 1,
                    match: { home: "Team A", away: "Team B" },
                },
            ];

            mockRoundsRepository.find.mockReturnValue({
                lean: () => ({
                    exec: () => Promise.resolve(mockRounds),
                }),
            });

            const mockConvertedResult = { converted: true };
            const mockConvertedSettlementResult = { settledConverted: true };

            jest.spyOn(roundQuery as any, "convertResult").mockReturnValue(mockConvertedResult);
            jest.spyOn(roundQuery as any, "convertSettlementResult").mockReturnValue(mockConvertedSettlementResult);

            // Act
            const result = await roundQuery.getList(10);

            // Assert
            expect(result).toEqual([
                {
                    roundId: mockRounds[0].id,
                    result: mockConvertedResult,
                    settlementResult: mockConvertedSettlementResult,
                    match: mockRounds[0].match,
                },
            ]);
            expect(roundQuery["convertResult"]).toHaveBeenCalledWith(mockRounds[0]);
            expect(roundQuery["convertSettlementResult"]).toHaveBeenCalledWith(mockConvertedResult);
        });

        it("should apply projections when provided", async () => {
            // Arrange
            const projections = { field1: 1, field2: 1 };
            mockRoundsRepository.find.mockReturnValue({
                lean: () => ({
                    exec: () => Promise.resolve([]),
                }),
            });

            // Act
            await roundQuery.getList(10, projections);

            // Assert
            expect(mockRoundsRepository.find).toHaveBeenCalledWith({}, projections, { sort: { _id: -1 }, limit: 10 });
        });
    });
});
