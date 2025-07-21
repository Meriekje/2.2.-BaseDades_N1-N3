package virtualpets.repositories;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;
import virtualpets.models.Pet;
import virtualpets.models.PetType;
import virtualpets.models.Role;
import virtualpets.models.User;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
class PetRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private PetRepository petRepository;

    private User testUser;
    private Pet testPet;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setUsername("testuser");
        testUser.setPassword("password123");
        testUser.setRole(Role.ROLE_USER);
        testUser = entityManager.persistAndFlush(testUser);

        testPet = new Pet();
        testPet.setName("Fluffy");
        testPet.setType(PetType.MAGPIE);
        testPet.setColor("#FF6B6B");
        testPet.setOwner(testUser);
        testPet = entityManager.persistAndFlush(testPet);
    }

    @Test
    void findByOwnerId_ReturnsOwnerPets() {
        List<Pet> pets = petRepository.findByOwnerId(testUser.getId());
        
        assertThat(pets).hasSize(1);
        assertThat(pets.get(0).getName()).isEqualTo("Fluffy");
    }

    @Test
    void findByIdAndOwnerId_ReturnsPetWhenOwnerMatches() {
        Optional<Pet> pet = petRepository.findByIdAndOwnerId(testPet.getId(), testUser.getId());
        
        assertThat(pet).isPresent();
        assertThat(pet.get().getName()).isEqualTo("Fluffy");
    }

    @Test
    void findByType_ReturnsPetsOfSpecificType() {
        List<Pet> pets = petRepository.findByType(PetType.MAGPIE);
        
        assertThat(pets).hasSize(1);
        assertThat(pets.get(0).getType()).isEqualTo(PetType.MAGPIE);
    }
}
